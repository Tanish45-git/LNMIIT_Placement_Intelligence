#!/usr/bin/env python3
import unittest
from scraper import PlacementDataValidator, LNMIITScraperEngine

class TestPlacementDataValidator(unittest.TestCase):
    def setUp(self):
        self.validator = PlacementDataValidator()

    def test_valid_record(self):
        record = {
            "totalBatchStrength": 612,
            "registeredStudents": 554,
            "studentsPlaced": 462,
            "placementPercentage": 83.39,
            "highestPackageLPA": 52.28,
            "averagePackageLPA": 13.14,
            "medianPackageLPA": 10.5,
            "totalJobOffers": 524
        }
        is_valid, errors = self.validator.validate_record(record)
        self.assertTrue(is_valid)
        self.assertEqual(len(errors), 0)

    def test_placed_exceeds_registered(self):
        record = {
            "totalBatchStrength": 500,
            "registeredStudents": 400,
            "studentsPlaced": 450, # Invalid!
            "placementPercentage": 112.5,
            "highestPackageLPA": 40.0,
            "averagePackageLPA": 12.0,
            "medianPackageLPA": 10.0,
            "totalJobOffers": 450
        }
        is_valid, errors = self.validator.validate_record(record)
        self.assertFalse(is_valid)
        self.assertTrue(any("cannot exceed registered" in e for e in errors))

    def test_highest_less_than_average(self):
        record = {
            "totalBatchStrength": 500,
            "registeredStudents": 400,
            "studentsPlaced": 380,
            "placementPercentage": 95.0,
            "highestPackageLPA": 10.0, # Lower than average!
            "averagePackageLPA": 15.0,
            "medianPackageLPA": 8.0,
            "totalJobOffers": 400
        }
        is_valid, errors = self.validator.validate_record(record)
        self.assertFalse(is_valid)
        self.assertTrue(any("cannot be lower than average" in e for e in errors))

    def test_pipeline_execution(self):
        engine = LNMIITScraperEngine(use_remote=False)
        result = engine.run_sync_pipeline()
        self.assertTrue(result["isValid"])
        self.assertIn("status", result)

if __name__ == "__main__":
    unittest.main()
