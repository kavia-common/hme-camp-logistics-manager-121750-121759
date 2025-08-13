#!/bin/bash
cd /home/kavia/workspace/code-generation/hme-camp-logistics-manager-121750-121759/burning_man_camp_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

