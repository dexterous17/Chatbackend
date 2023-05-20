SELECT DISTINCT u.id, u.name, u.email, u.avatar_url 
FROM users u 
JOIN (
  SELECT sender_id as user_id, recipient_id as contact_id 
  FROM messages 
  WHERE sender_id = 10 
  UNION 
  SELECT recipient_id as user_id, sender_id as contact_id 
  FROM messages 
  WHERE recipient_id = 10
) m ON u.id = m.contact_id
