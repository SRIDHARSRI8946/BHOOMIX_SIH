import unittest
from fastapi.testclient import TestClient
from app.main import app

class TestBhoomiX(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_1_health_check(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")

    def test_2_officer_login(self):
        response = self.client.post("/api/auth/login", json={
            "email": "officer@bhoomix.gov.in",
            "password": "Officer@123"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["user"]["role"], "REVENUE_OFFICER")

    def test_3_citizen_login(self):
        response = self.client.post("/api/auth/login", json={
            "email": "citizen@bhoomix.gov.in",
            "password": "Citizen@123"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["user"]["role"], "CITIZEN")

    def test_4_existing_records_search(self):
        login_res = self.client.post("/api/auth/login", json={
            "email": "officer@bhoomix.gov.in",
            "password": "Officer@123"
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        response = self.client.get("/api/existing-records/search?survey_number=132/1", headers=headers)
        self.assertEqual(response.status_code, 200)
        records = response.json()
        self.assertGreaterEqual(len(records), 1)
        er1 = next(r for r in records if r["record_id"] == "ER-001")
        self.assertEqual(er1["owner_name"], "R. Ananthi")
        self.assertEqual(er1["land_extent_text"], "0.97.5")
        self.assertEqual(er1["land_extent_unit"], "SOURCE_NOTATION_REQUIRES_CONFIRMATION")

    def test_5_demo_discrepancy_flow(self):
        # 1. Citizen login
        cit_res = self.client.post("/api/auth/login", json={
            "email": "citizen@bhoomix.gov.in",
            "password": "Citizen@123"
        })
        cit_token = cit_res.json()["access_token"]
        cit_headers = {"Authorization": f"Bearer {cit_token}"}

        # 2. Upload sample deed
        dummy_content = b"%PDF-1.4 ... Dharmapuri Pappireddipatti Payanatham 132/1 3463 R. Ananthi 1.20 Acres"
        files = {"file": ("demo_deed_132_1.pdf", dummy_content, "application/pdf")}
        upload_res = self.client.post("/api/citizen/upload", headers=cit_headers, files=files)
        self.assertEqual(upload_res.status_code, 200)
        upload_data = upload_res.json()
        sub_id = upload_data["submission_id"]
        ocr = upload_data["ocr_result"]
        self.assertEqual(ocr["survey_number"], "132/1")
        self.assertEqual(ocr["owner_name"], "R. Ananthi")
        self.assertEqual(ocr["area"], "1.20 Acres")

        # 3. Citizen submits to officer
        submit_res = self.client.post(f"/api/citizen/submissions/{sub_id}/submit", headers=cit_headers)
        self.assertEqual(submit_res.status_code, 200)
        sub_data = submit_res.json()
        self.assertTrue(sub_data["discrepancy_detected"])

        # 4. Officer inspection
        off_res = self.client.post("/api/auth/login", json={
            "email": "officer@bhoomix.gov.in",
            "password": "Officer@123"
        })
        off_token = off_res.json()["access_token"]
        off_headers = {"Authorization": f"Bearer {off_token}"}

        comp_res = self.client.get(f"/api/officer/submissions/{sub_id}/comparison", headers=off_headers)
        self.assertEqual(comp_res.status_code, 200)
        comp_data = comp_res.json()
        self.assertEqual(comp_data["status"], "DISCREPANCY_DETECTED")
        self.assertTrue(comp_data["requires_manual_verification"])

        val_results = comp_data["validation_results"]
        extent_res = next(v for v in val_results if v["field_name"] == "Land Extent")
        self.assertEqual(extent_res["match_status"], "MANUAL_VERIFICATION_REQUIRED")

        # 5. Manual verification approval
        verif_res = self.client.post(
            f"/api/officer/submissions/{sub_id}/manual-verification",
            headers=off_headers,
            json={
                "decision": "APPROVE_AFTER_VERIFICATION",
                "remarks": "Examined original historical deed. Source notation 0.97.5 confirmed. Approved.",
                "corrected_values": {}
            }
        )
        self.assertEqual(verif_res.status_code, 200)
        self.assertEqual(verif_res.json()["status"], "APPROVED")
        self.assertIn("approval_reference", verif_res.json())

        # 6. Verify approval PDF download
        pdf_res = self.client.get(f"/api/pdf/download/{sub_id}", headers=off_headers)
        self.assertEqual(pdf_res.status_code, 200)
        self.assertEqual(pdf_res.headers["content-type"], "application/pdf")
        self.assertGreater(len(pdf_res.content), 1000)

if __name__ == "__main__":
    unittest.main()
