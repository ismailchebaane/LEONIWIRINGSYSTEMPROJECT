import React, { useContext, useState } from 'react';
import { AuthContext } from '../../Components/AuthContext/AuthContext';
import axios from 'axios';

export default function Settings() {
  const { user, dispatch } = useContext(AuthContext);

  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
console.log(user._id)
const handleUpdateInfo = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.put(`http://localhost:4000/api/admin/${user._id}`, {
        
        email: email,
        password: password,
      });
  
      if (res.status === 200) {
      
        dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
  
        alert('updated');
      } else {
        alert('failed');
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <div>
      <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 mt-20">
        <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">
          Account settings
        </h2>

        <form onSubmit={handleUpdateInfo}>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            

            <div>
              <label
                className="text-gray-700 dark:text-gray-200"
                htmlFor="emailAddress"
              >
                Email Address
              </label>
              <input
                id="emailAddress"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label
                className="text-gray-700 dark:text-gray-200"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
              />
            </div>

           

        </div>

        <div class="flex justify-end mt-6">
            <button class="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Save</button>
        </div>
    </form>
</section>
    </div>
  )
}
