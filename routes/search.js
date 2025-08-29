const express = require('express');
const searchService = require('../services/searchService');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Búsqueda principal
router.get('/', async (req, res) => {
  try {
    const { q: query, ...filters } = req.query;
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 12,
      sortBy: req.query.sortBy || 'relevance',
      sortOrder: req.query.sortOrder || 'desc',
      userId: req.user?.userId || null
    };

    const results = await searchService.search(query, filters, options);

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en la búsqueda',
      messageEs: 'Error en la búsqueda',
      messageEn: 'Search error'
    });
  }
});

// Obtener sugerencias de búsqueda
router.get('/suggestions', async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;

    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const suggestions = await searchService.getSuggestions(query, Number(limit));

    res.json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener sugerencias'
    });
  }
});

// Autocompletar
router.get('/autocomplete', async (req, res) => {
  try {
    const { q: query, limit = 5 } = req.query;

    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const suggestions = await searchService.autocomplete(query, Number(limit));

    res.json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    console.error('Autocomplete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en autocompletar'
    });
  }
});

// Obtener filtros disponibles
router.get('/filters', async (req, res) => {
  try {
    const { q: query, ...currentFilters } = req.query;
    
    const filters = await searchService.getAvailableFilters(query, currentFilters);

    res.json({
      success: true,
      data: filters
    });

  } catch (error) {
    console.error('Filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener filtros'
    });
  }
});

// Productos relacionados
router.get('/related/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 8 } = req.query;

    const relatedProducts = await searchService.getRelatedProducts(productId, Number(limit));

    res.json({
      success: true,
      data: relatedProducts
    });

  } catch (error) {
    console.error('Related products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos relacionados'
    });
  }
});

// Búsquedas populares
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const popularSearches = searchService.getPopularSearches(Number(limit));

    res.json({
      success: true,
      data: popularSearches
    });

  } catch (error) {
    console.error('Popular searches error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener búsquedas populares'
    });
  }
});

// Tendencias de búsqueda
router.get('/trends', async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    const trends = searchService.getSearchTrends(period);

    res.json({
      success: true,
      data: trends
    });

  } catch (error) {
    console.error('Search trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tendencias'
    });
  }
});

// RUTAS AUTENTICADAS

// Historial de búsqueda del usuario
router.get('/history', auth, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const history = await searchService.getUserSearchHistory(req.user.userId, Number(limit));

    res.json({
      success: true,
      data: history
    });

  } catch (error) {
    console.error('Search history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial'
    });
  }
});

// Limpiar historial de búsqueda
router.delete('/history', auth, async (req, res) => {
  try {
    await searchService.clearUserSearchHistory(req.user.userId);

    res.json({
      success: true,
      message: 'Historial de búsqueda eliminado',
      messageEs: 'Historial de búsqueda eliminado',
      messageEn: 'Search history cleared'
    });

  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al limpiar historial'
    });
  }
});

// Sugerencias personalizadas
router.get('/personalized', auth, async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    
    const suggestions = await searchService.getPersonalizedSuggestions(req.user.userId, Number(limit));

    res.json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    console.error('Personalized suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener sugerencias personalizadas'
    });
  }
});

// Búsqueda por imagen (futuro)
router.post('/visual', auth, async (req, res) => {
  try {
    // Placeholder para búsqueda visual
    res.json({
      success: false,
      message: 'Búsqueda visual no disponible aún',
      messageEs: 'Búsqueda visual no disponible aún',
      messageEn: 'Visual search not available yet'
    });

  } catch (error) {
    console.error('Visual search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en búsqueda visual'
    });
  }
});

// Búsqueda por voz (futuro)
router.post('/voice', auth, async (req, res) => {
  try {
    // Placeholder para búsqueda por voz
    res.json({
      success: false,
      message: 'Búsqueda por voz no disponible aún',
      messageEs: 'Búsqueda por voz no disponible aún',
      messageEn: 'Voice search not available yet'
    });

  } catch (error) {
    console.error('Voice search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en búsqueda por voz'
    });
  }
});

module.exports = router;