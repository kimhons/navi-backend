// Export all models from a single file for easy importing

module.exports = {
  User: require('./User'),
  Route: require('./Route'),
  Place: require('./Place'),
  Trip: require('./Trip'),
  Review: require('./Review'),
  Message: require('./Message'),
  Notification: require('./Notification'),
  OfflineMap: require('./OfflineMap'),
  SafetyAlert: require('./SafetyAlert'),
  FriendRequest: require('./FriendRequest'),
  Group: require('./Group')
};
