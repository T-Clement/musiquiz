import React from 'react'

export default function UserRegisterForm({setModalContent}) {
  return (

    <form>
        <div className="space-y-6">
        <div>
            <label className="text-gray-800 text-sm mb-2 block">Email</label>
            <input name="email" type="text" className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Entrez votre email" />
        </div>
        <div>
            <label className="text-gray-800 text-sm mb-2 block">Pseudo</label>
            <input name="pseudo" type="text" className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Entrez votre pseudo" />
        </div>
        <div>
            <label className="text-gray-800 text-sm mb-2 block">Confirmez le mot de passe</label>
            <input name="password" type="password" className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Entrez votre mot de passe" />
        </div>

        </div>

        <div className="!mt-12">
        <button type="button" className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
            Créer votre compte
        </button>
        </div>
        <p className="text-gray-800 text-sm mt-6 text-center">Vous avez un compte ? <a onClick={() => setModalContent("login")} class="text-blue-600 font-semibold hover:underline ml-1">Connectez vous</a></p>
    </form>    
)
}
