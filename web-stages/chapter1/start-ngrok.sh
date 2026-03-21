#!/bin/bash

SESSION="ngrok"
URL_FILE="ngrok_urls.txt"

STAGE1_PORT=3938
STAGE2_PORT=2765

echo "[*] Starting ngrok tunnels in tmux session: $SESSION"

tmux kill-session -t $SESSION 2>/dev/null
rm -f $URL_FILE

tmux new-session -d -s $SESSION

# Stage 1
tmux send-keys -t $SESSION "echo '[*] Starting Stage1 on port $STAGE1_PORT'; ngrok http $STAGE1_PORT --log=stdout" C-m

tmux split-window -h -t $SESSION

# Stage 2
tmux send-keys -t $SESSION "echo '[*] Starting Stage2 on port $STAGE2_PORT'; ngrok http $STAGE2_PORT --log=stdout" C-m

tmux select-pane -t 0

if [[ -t 1 ]]; then
    tmux attach -t $SESSION
else
    echo "[*] Non-interactive shell detected, skipping tmux attach"
fi

sleep 5

echo "[*] Fetching public URLs..."
curl --silent http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[].public_url' > $URL_FILE

echo "[*] Public URLs saved to $URL_FILE"
cat $URL_FILE

echo "[*] Done. Stage1: $STAGE1_PORT, Stage2: $STAGE2_PORT"