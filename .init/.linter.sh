#!/bin/bash
cd /home/kavia/workspace/code-generation/smart-expense-tracker-223884-223893/expense_tracker_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

