from app.validation import InvestigationValidator

validator = InvestigationValidator()

examples = [

    {
        "name": "Complete Blood Count",
        "reason": "Doctor advised CBC"
    },

    {
        "name": "Liver Function Test",
        "reason": "Doctor advised LFT"
    },

    {
        "name": "Ultrasound Whole Abdomen",
        "reason": "Doctor advised USG"
    },

    {
        "name": "HbA1c",
        "reason": "Doctor advised diabetic workup"
    }

]

for item in examples:

    print()

    print(validator.validate(item))