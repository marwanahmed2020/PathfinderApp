# Pathfinding Simulator

A web-based pathfinding simulator that visualizes A* and Dijkstra's algorithms. Built with Django and JavaScript.

## Features

- Interactive grid where you can draw walls
- Set start and end nodes
- Choose between A* and Dijkstra's algorithms
- Adjustable grid size
- Speed control for algorithm visualization
- Visual feedback for visited nodes and the final path
- Responsive design

## Local Development

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Run the development server:
   ```
   python manage.py runserver
   ```
6. Open your browser and navigate to `http://127.0.0.1:8000`

## Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - **Start Command**: `gunicorn PathfinderApp.wsgi:application`
   - **Environment Variables**: None required for basic deployment
4. Deploy the service

## Technologies Used

- Django
- JavaScript (ES6+)
- HTML5 Canvas
- CSS3
- Gunicorn
- WhiteNoise

## License

MIT 