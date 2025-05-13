const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Secret key for JWT signing (should be in environment variable in production)
const JWT_SECRET = 'secretKey';

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
}

// Authorization middleware for role-based access control
function authorize(roles) {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (roles.includes(userRole)) {
            next();
        } else {
            res.status(403).json({ error: 'Unauthorized access' });
        }
    };
}

// Custom error class for validation errors
class ValidationError extends Error {
    constructor(message, errors) {
        super(message);
        this.name = 'ValidationError';
        this.errors = errors;
    }
}

// Sample in-memory data (replace with database in production)
const users = [];
const projects = [];
const agents = [];
const documents = [];
const webTasks = [];
const analyticsData = {
    compliance: [],
    performance: []
};

// API Endpoints

// User Authentication
app.post('/auth/login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    
    // Mock user lookup (replace with database query)
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token });
});

// User Management
app.post('/users', authenticateToken, authorize(['admin']), [
    body('username').notEmpty().withMessage('Username is required').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('role').notEmpty().withMessage('Role is required').isString().custom(value => {
        const validRoles = ['admin', 'project_manager', 'technical_lead', 'support_engineer'];
        if (!validRoles.includes(value)) {
            throw new Error('Invalid role');
        }
        return true;
    }).withMessage('Invalid role')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, password, role } = req.body;
    
    const newUser = {
        id: users.length + 1,
        username,
        password, // In production, hash the password
        role
    };
    
    users.push(newUser);
    res.status(201).json(newUser);
});

app.get('/users/:id', authenticateToken, authorize(['admin']), (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
});

// Project Management
app.post('/projects', authenticateToken, authorize(['admin', 'project_manager']), [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('owner_id').notEmpty().withMessage('Owner ID is required').isInt().withMessage('Owner ID must be a number')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, description, owner_id } = req.body;
    
    const newProject = {
        id: projects.length + 1,
        name,
        description,
        owner_id,
        created_at: new Date().toISOString()
    };
    
    projects.push(newProject);
    res.status(201).json(newProject);
});

app.get('/projects', authenticateToken, (req, res) => {
    // Return projects based on user role or ownership (simplified here)
    res.json(projects);
});

app.get('/projects/:id', authenticateToken, (req, res) => {
    const projectId = parseInt(req.params.id);
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
});

app.put('/projects/:id', authenticateToken, authorize(['admin', 'project_manager']), [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('owner_id').notEmpty().withMessage('Owner ID is required').isInt().withMessage('Owner ID must be a number')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const projectId = parseInt(req.params.id);
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' });
    }
    
    const { name, description, owner_id } = req.body;
    projects[projectIndex] = {
        ...projects[projectIndex],
        name,
        description,
        owner_id,
        updated_at: new Date().toISOString()
    };
    
    res.json(projects[projectIndex]);
});

app.delete('/projects/:id', authenticateToken, authorize(['admin', 'project_manager']), (req, res) => {
    const projectId = parseInt(req.params.id);
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' });
    }
    
    projects.splice(projectIndex, 1);
    res.status(204).send();
});

// Agent Management
app.post('/agents', authenticateToken, authorize(['admin', 'project_manager']), [
    body('name').notEmpty().withMessage('Name is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('project_id').notEmpty().withMessage('Project ID is required').isInt().withMessage('Project ID must be a number')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, type, project_id } = req.body;
    
    const newAgent = {
        id: agents.length + 1,
        name,
        type,
        project_id,
        status: 'deployed',
        created_at: new Date().toISOString()
    };
    
    agents.push(newAgent);
    res.status(201).json(newAgent);
});

app.get('/agents', authenticateToken, (req, res) => {
    // Return agents based on user role or project ownership (simplified here)
    res.json(agents);
});

app.get('/agents/:id', authenticateToken, (req, res) => {
    const agentId = parseInt(req.params.id);
    const agent = agents.find(a => a.id === agentId);
    
    if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json(agent);
});

app.put('/agents/:id', authenticateToken, authorize(['admin', 'project_manager']), [
    body('name').notEmpty().withMessage('Name is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('status').notEmpty().withMessage('Status is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const agentId = parseInt(req.params.id);
    const agentIndex = agents.findIndex(a => a.id === agentId);
    
    if (agentIndex === -1) {
        return res.status(404).json({ error: 'Agent not found' });
    }
    
    const { name, type, status } = req.body;
    agents[agentIndex] = {
        ...agents[agentIndex],
        name,
        type,
        status,
        updated_at: new Date().toISOString()
    };
    
    res.json(agents[agentIndex]);
});

app.delete('/agents/:id', authenticateToken, authorize(['admin', 'project_manager']), (req, res) => {
    const agentId = parseInt(req.params.id);
    const agentIndex = agents.findIndex(a => a.id === agentId);
    
    if (agentIndex === -1) {
        return res.status(404).json({ error: 'Agent not found' });
    }
    
    agents.splice(agentIndex, 1);
    res.status(204).send();
});

// Document Management
app.post('/documents', authenticateToken, authorize(['admin', 'project_manager', 'technical_lead']), [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('project_id').notEmpty().withMessage('Project ID is required').isInt().withMessage('Project ID must be a number')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { title, content, project_id } = req.body;
    
    const newDocument = {
        id: documents.length + 1,
        title,
        content,
        project_id,
        created_at: new Date().toISOString()
    };
    
    documents.push(newDocument);
    res.status(201).json(newDocument);
});

app.get('/documents', authenticateToken, (req, res) => {
    // Return documents based on user role or project ownership (simplified here)
    res.json(documents);
});

app.get('/documents/:id', authenticateToken, (req, res) => {
    const documentId = parseInt(req.params.id);
    const document = documents.find(d => d.id === documentId);
    
    if (!document) {
        return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(document);
});

app.put('/documents/:id', authenticateToken, authorize(['admin', 'project_manager', 'technical_lead']), [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const documentId = parseInt(req.params.id);
    const documentIndex = documents.findIndex(d => d.id === documentId);
    
    if (documentIndex === -1) {
        return res.status(404).json({ error: 'Document not found' });
    }
    
    const { title, content } = req.body;
    documents[documentIndex] = {
        ...documents[documentIndex],
        title,
        content,
        updated_at: new Date().toISOString()
    };
    
    res.json(documents[documentIndex]);
});

app.delete('/documents/:id', authenticateToken, authorize(['admin', 'project_manager']), (req, res) => {
    const documentId = parseInt(req.params.id);
    const documentIndex = documents.findIndex(d => d.id === documentId);
    
    if (documentIndex === -1) {
        return res.status(404).json({ error: 'Document not found' });
    }
    
    documents.splice(documentIndex, 1);
    res.status(204).send();
});

// Analytics Data Retrieval
app.get('/analytics/compliance', authenticateToken, authorize(['admin', 'project_manager']), (req, res) => {
    // Mock compliance data (replace with actual data retrieval)
    res.json(analyticsData.compliance);
});

app.get('/analytics/performance', authenticateToken, authorize(['admin', 'project_manager', 'technical_lead']), (req, res) => {
    // Mock performance data (replace with actual data retrieval)
    res.json(analyticsData.performance);
});

// Web Automation Task Management
app.post('/webtasks', authenticateToken, authorize(['admin', 'project_manager']), [
    body('name').notEmpty().withMessage('Name is required'),
    body('url').notEmpty().withMessage('URL is required').isURL().withMessage('Invalid URL format'),
    body('project_id').notEmpty().withMessage('Project ID is required').isInt().withMessage('Project ID must be a number')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, url, project_id } = req.body;
    
    const newWebTask = {
        id: webTasks.length + 1,
        name,
        url,
        project_id,
        status: 'pending',
        created_at: new Date().toISOString()
    };
    
    webTasks.push(newWebTask);
    res.status(201).json(newWebTask);
});

app.get('/webtasks', authenticateToken, (req, res) => {
    // Return web tasks based on user role or project ownership (simplified here)
    res.json(webTasks);
});

app.get('/webtasks/:id', authenticateToken, (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = webTasks.find(t => t.id === taskId);
    
    if (!task) {
        return res.status(404).json({ error: 'Web task not found' });
    }
    
    res.json(task);
});

app.put('/webtasks/:id', authenticateToken, authorize(['admin', 'project_manager']), [
    body('name').notEmpty().withMessage('Name is required'),
    body('url').notEmpty().withMessage('URL is required').isURL().withMessage('Invalid URL format'),
    body('status').notEmpty().withMessage('Status is required').isIn(['pending', 'running', 'completed', 'failed']).withMessage('Invalid status')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const taskId = parseInt(req.params.id);
    const taskIndex = webTasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Web task not found' });
    }
    
    const { name, url, status } = req.body;
    webTasks[taskIndex] = {
        ...webTasks[taskIndex],
        name,
        url,
        status,
        updated_at: new Date().toISOString()
    };
    
    res.json(webTasks[taskIndex]);
});

app.delete('/webtasks/:id', authenticateToken, authorize(['admin', 'project_manager']), (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = webTasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Web task not found' });
    }
    
    webTasks.splice(taskIndex, 1);
    res.status(204).send();
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    if (err instanceof ValidationError) {
        return res.status(400).json({ message: err.message, errors: err.errors });
    }
    
    res.status(500).json({ error: 'Something broke!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
