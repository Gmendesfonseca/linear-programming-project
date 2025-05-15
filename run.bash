# Set up frontend
cd ./frontend
npm install
npm run dev

# Set up backend
cd ../backend
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors
python3 -m flask run
