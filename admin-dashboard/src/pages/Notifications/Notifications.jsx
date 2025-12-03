import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await axios.get('http://svtn3local01:9095/api/notifications/unread-overlimit', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setNotifications(res.data)
      } catch (err) {
        setError('Failed to load notifications.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [token])

  if (loading) return <div className="p-4">Loading notifications...</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>
  if (notifications.length === 0)
    return (
      <div className="p-4  mt-24 text-center text-gray-600 text-lg">
        No users have more than 10 unread notifications.
      </div>
    )

  return (
    <div className="p-6 mt-24 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Users with More Than 10 Unread Notifications</h1>

      {notifications.map(({ userThatDidntSign, list }) => (
        <div key={userThatDidntSign} className="mb-10 border rounded-lg shadow-sm p-4 bg-white">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            User: {userThatDidntSign}
            <span className="ml-2 inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded">
              {list.length} unread notifications
            </span>
          </h2>

          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {list.map((notif) => (
              <li
                key={notif.id}
                className={`p-3 rounded border ${
                  notif.read ? 'bg-gray-100 text-gray-500' : 'bg-yellow-50 text-black'
                }`}
              >
                <p className="font-medium">{notif.message}</p>
                <p className="text-sm text-gray-600">
                  Equipment Serial: {notif.equipmentSerialNumber || 'N/A'}
                </p>
                <small className="text-xs text-gray-400">
                  {new Date(notif.timestamp).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
