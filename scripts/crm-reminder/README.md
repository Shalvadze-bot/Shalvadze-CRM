# Existing CRM reminder

This is the source saved to the existing SHALVADZE CRM Follow-up Reminder Apps Script project on 6 October 2026. Keep the existing time-based trigger targeting `sendCRMReminder`; do not install another reminder.

The live CONTROL CENTER D4:K1000 queue is authoritative for notification categories. Company Intelligence and Opportunities define the one current next action. No Marketing Calendar or Gmail access is required.

`previewCRMReminder` is read-only and sends nothing. `sendCRMReminder` emails only the fixed founder recipient. Coverage remains TOMORROW_ONLY until the founder chooses DAILY_DIGEST; changing coverage is a separate operational choice. Header, formula, unknown-ID, missing-date and duplicate-action errors fail closed. Protected and waiting accounts may be explicitly undated.

The preview was checked against the live CRM: 0 overdue buyer follow-ups, 3 overdue internal actions, 6 tomorrow follow-up reviews, 32 upcoming reviews, 1 protected opportunity and 6 waiting accounts.
