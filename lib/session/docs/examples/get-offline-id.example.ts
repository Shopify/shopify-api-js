async function myWebhookHandler(topic, shop) {
  const offlineSessionId = await shopify.session.getOfflineId({shop});

  // use sessionId to retrieve session from app's session storage
  // getSessionFromStorage() must be provided by application
  const session = await getSessionFromStorage(offlineSessionId);

  // Perform webhook actions
}
