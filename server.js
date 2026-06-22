import express from 'express'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Debug middleware to log static file requests
app.use('/assets', (req, res, next) => {
  console.log(`Static file request: ${req.path}`)
  next()
})

// Serve static files from the React app build directory
app.use('/assets', express.static(path.join(__dirname, 'dist/assets'), {
  maxAge: '1y', // Cache static assets for 1 year
  etag: true,
  lastModified: true
}))

app.use('/vite.svg', express.static(path.join(__dirname, 'dist/vite.svg')))

// Performance monitoring endpoints (same as server-example.js)
const performanceMetrics = []
const errors = []
const alerts = []

// Performance metrics endpoint
app.post('/api/performance-metrics', async (req, res) => {
  try {
    const metricData = {
      ...req.body,
      receivedAt: new Date().toISOString(),
    }
    
    performanceMetrics.push(metricData)
    
    // Real-time alerting for poor performance
    if (metricData.metric === 'LCP' && metricData.value > 4000) {
      const alert = {
        type: 'performance',
        severity: 'warning',
        message: `Poor LCP detected: ${metricData.value}ms on ${metricData.url}`,
        metadata: metricData,
        timestamp: new Date().toISOString(),
      }
      alerts.push(alert)
      console.warn('🚨 Performance Alert:', alert)
    }
    
    if (metricData.metric === 'MemoryUsage' && metricData.value > 50) {
      const alert = {
        type: 'performance',
        severity: 'critical',
        message: `High memory usage: ${metricData.value}MB on ${metricData.url}`,
        metadata: metricData,
        timestamp: new Date().toISOString(),
      }
      alerts.push(alert)
      console.warn('🚨 Memory Alert:', alert)
    }
    
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error storing performance metric:', error)
    res.status(500).json({ error: 'Failed to store metric' })
  }
})

// Error tracking endpoint
app.post('/api/errors', async (req, res) => {
  try {
    const errorData = {
      ...req.body,
      receivedAt: new Date().toISOString(),
    }
    
    errors.push(errorData)
    
    // Alert for critical errors
    if (errorData.type === 'JavaScript Error' || errorData.type === 'Unhandled Promise Rejection') {
      const alert = {
        type: 'error',
        severity: 'critical',
        message: `${errorData.type}: ${errorData.message}`,
        metadata: errorData,
        timestamp: new Date().toISOString(),
      }
      alerts.push(alert)
      console.error('🚨 Error Alert:', alert)
    }
    
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error storing error data:', error)
    res.status(500).json({ error: 'Failed to store error' })
  }
})

// Performance alerts endpoint
app.post('/api/performance-alerts', async (req, res) => {
  try {
    const alertData = {
      ...req.body,
      receivedAt: new Date().toISOString(),
    }
    
    alerts.push(alertData)
    console.warn('🚨 Performance Budget Alert:', alertData)
    
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error storing alert:', error)
    res.status(500).json({ error: 'Failed to store alert' })
  }
})

// Analytics dashboard endpoints
app.get('/api/analytics/metrics', (req, res) => {
  const { metric, limit = 100 } = req.query
  
  let filteredMetrics = performanceMetrics
  if (metric) {
    filteredMetrics = performanceMetrics.filter(m => m.metric === metric)
  }
  
  res.json({
    metrics: filteredMetrics.slice(-limit),
    total: filteredMetrics.length,
    summary: getMetricsSummary(filteredMetrics)
  })
})

app.get('/api/analytics/errors', (req, res) => {
  const { limit = 100 } = req.query
  
  res.json({
    errors: errors.slice(-limit),
    total: errors.length,
    summary: getErrorsSummary(errors)
  })
})

app.get('/api/analytics/alerts', (req, res) => {
  const { limit = 50 } = req.query
  
  res.json({
    alerts: alerts.slice(-limit),
    total: alerts.length,
    summary: getAlertsSummary(alerts)
  })
})

// Helper functions
function getMetricsSummary(metrics) {
  const summary = {}
  
  metrics.forEach(metric => {
    if (!summary[metric.metric]) {
      summary[metric.metric] = {
        count: 0,
        values: [],
        avg: 0,
        min: Infinity,
        max: -Infinity
      }
    }
    
    const stat = summary[metric.metric]
    stat.count++
    stat.values.push(metric.value)
    stat.min = Math.min(stat.min, metric.value)
    stat.max = Math.max(stat.max, metric.value)
  })
  
  // Calculate averages
  Object.keys(summary).forEach(metric => {
    const stat = summary[metric]
    stat.avg = stat.values.reduce((sum, val) => sum + val, 0) / stat.values.length
  })
  
  return summary
}

function getErrorsSummary(errors) {
  const summary = {
    total: errors.length,
    byType: {},
    byUrl: {},
    recent: errors.slice(-10)
  }
  
  errors.forEach(error => {
    summary.byType[error.type] = (summary.byType[error.type] || 0) + 1
    summary.byUrl[error.url] = (summary.byUrl[error.url] || 0) + 1
  })
  
  return summary
}

function getAlertsSummary(alerts) {
  const summary = {
    total: alerts.length,
    byType: {},
    bySeverity: {},
    recent: alerts.slice(-10)
  }
  
  alerts.forEach(alert => {
    summary.byType[alert.type] = (summary.byType[alert.type] || 0) + 1
    summary.bySeverity[alert.severity] = (summary.bySeverity[alert.severity] || 0) + 1
  })
  
  return summary
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    metrics: performanceMetrics.length,
    errors: errors.length,
    alerts: alerts.length
  })
})

// Serve robots.txt to prevent crawling
app.get('/robots.txt', (req, res) => {
  res.type('text/plain')
  res.sendFile(path.join(__dirname, 'dist', 'robots.txt'))
})

// Catch all handler: send back React's index.html file for any non-API routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, '0.0.0.0', () => {
  console.log(`React A11y Test app running on port ${port}`)
  console.log(`Analytics dashboard available at /api/analytics/`)
  console.log(`Health check available at /health`)
})

export default app
