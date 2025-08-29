import React, { useEffect, useState } from 'react';
import {
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import {
  Notifications,
  NotificationsOff,
  NotificationsActive,
  Settings
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { useAuth } from '../../contexts/AuthContext';

const PushNotificationManager = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Configuración de notificaciones
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: true,
    stockAlerts: true,
    priceDrops: true,
    loyaltyRewards: true,
    newProducts: false
  });

  useEffect(() => {
    checkPushSupport();
    checkSubscriptionStatus();
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, []);

  // Verificar soporte para push notifications
  const checkPushSupport = () => {
    const supported = 'serviceWorker' in navigator && 
                     'PushManager' in window && 
                     'Notification' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermissionStatus(Notification.permission);
    }
  };

  // Verificar estado de suscripción actual
  const checkSubscriptionStatus = async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        setSubscription(existingSubscription);
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  // Manejar mensajes del service worker
  const handleServiceWorkerMessage = (event) => {
    const { type, productId, couponCode } = event.data;

    switch (type) {
      case 'ADD_TO_CART':
        // Lógica para agregar al carrito desde notificación
        console.log('Add to cart from notification:', productId);
        break;
      case 'APPLY_COUPON':
        // Lógica para aplicar cupón desde notificación
        console.log('Apply coupon from notification:', couponCode);
        break;
      default:
        break;
    }
  };

  // Solicitar permisos y suscribirse
  const requestPermissionAndSubscribe = async () => {
    if (!isSupported) {
      showSnackbar('Las notificaciones push no están soportadas en este navegador', 'warning');
      return;
    }

    if (!isAuthenticated) {
      showSnackbar('Debes iniciar sesión para activar notificaciones', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      // Solicitar permiso
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);

      if (permission !== 'granted') {
        showSnackbar('Permisos de notificación denegados', 'error');
        setIsLoading(false);
        return;
      }

      // Registrar service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Obtener VAPID public key
      const vapidResponse = await axios.get('/api/notifications/vapid-public-key');
      const vapidPublicKey = vapidResponse.data.publicKey;

      // Crear suscripción
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // Enviar suscripción al servidor
      await axios.post('/api/notifications/subscribe', {
        subscription: pushSubscription.toJSON()
      });

      setSubscription(pushSubscription);
      setIsSubscribed(true);
      showSnackbar('¡Notificaciones activadas exitosamente!', 'success');

    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      showSnackbar('Error al activar notificaciones', 'error');
    }

    setIsLoading(false);
  };

  // Desuscribirse
  const unsubscribe = async () => {
    if (!subscription) return;

    setIsLoading(true);

    try {
      // Desuscribirse del navegador
      await subscription.unsubscribe();

      // Notificar al servidor
      await axios.post('/api/notifications/unsubscribe', {
        endpoint: subscription.endpoint
      });

      setSubscription(null);
      setIsSubscribed(false);
      showSnackbar('Notificaciones desactivadas', 'info');

    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      showSnackbar('Error al desactivar notificaciones', 'error');
    }

    setIsLoading(false);
  };

  // Enviar notificación de prueba
  const sendTestNotification = async () => {
    if (!isSubscribed) return;

    try {
      await axios.post('/api/notifications/test', {
        title: '🧪 Notificación de Prueba',
        body: 'Si ves esto, ¡las notificaciones funcionan perfectamente!',
        icon: '/icons/icon-192x192.png',
        url: '/'
      });

      showSnackbar('Notificación de prueba enviada', 'success');

    } catch (error) {
      console.error('Error sending test notification:', error);
      showSnackbar('Error enviando notificación de prueba', 'error');
    }
  };

  // Mostrar snackbar
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Cerrar snackbar
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Convertir VAPID key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Actualizar configuración de notificaciones
  const updateNotificationSettings = (setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  if (!isSupported) {
    return null; // No mostrar nada si no está soportado
  }

  return (
    <>
      {/* Botón principal */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant={isSubscribed ? "outlined" : "contained"}
          color={isSubscribed ? "secondary" : "primary"}
          startIcon={
            isSubscribed ? <NotificationsActive /> : 
            permissionStatus === 'denied' ? <NotificationsOff /> : 
            <Notifications />
          }
          onClick={isSubscribed ? () => setShowSettingsDialog(true) : requestPermissionAndSubscribe}
          disabled={isLoading || permissionStatus === 'denied'}
          size="small"
        >
          {isSubscribed ? 'Notificaciones' : 'Activar Notificaciones'}
        </Button>

        {isSubscribed && (
          <Chip
            icon={<NotificationsActive />}
            label="Activas"
            color="success"
            size="small"
          />
        )}
      </Box>

      {/* Dialog de configuración */}
      <Dialog 
        open={showSettingsDialog} 
        onClose={() => setShowSettingsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Settings />
            Configuración de Notificaciones
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Personaliza qué tipo de notificaciones quieres recibir
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.orderUpdates}
                  onChange={(e) => updateNotificationSettings('orderUpdates', e.target.checked)}
                />
              }
              label="Actualizaciones de pedidos"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.promotions}
                  onChange={(e) => updateNotificationSettings('promotions', e.target.checked)}
                />
              }
              label="Promociones y ofertas especiales"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.stockAlerts}
                  onChange={(e) => updateNotificationSettings('stockAlerts', e.target.checked)}
                />
              }
              label="Alertas de disponibilidad"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.priceDrops}
                  onChange={(e) => updateNotificationSettings('priceDrops', e.target.checked)}
                />
              }
              label="Bajadas de precio"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.loyaltyRewards}
                  onChange={(e) => updateNotificationSettings('loyaltyRewards', e.target.checked)}
                />
              }
              label="Recompensas de fidelidad"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.newProducts}
                  onChange={(e) => updateNotificationSettings('newProducts', e.target.checked)}
                />
              }
              label="Nuevos productos"
            />
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Acciones de prueba
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={sendTestNotification}
              disabled={!isSubscribed}
              sx={{ mr: 1 }}
            >
              Enviar Prueba
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={unsubscribe}
              disabled={!isSubscribed}
            >
              Desactivar
            </Button>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setShowSettingsDialog(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={closeSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PushNotificationManager;