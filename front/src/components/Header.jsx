import React from 'react'
import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className='flex border border-white-800 p-6'>
        
        <h1 className='me-auto'><Link to="/">Musiquiz</Link></h1>

        <nav>
            <ul className='flex gap-x-6'>
                <li>Parcourir</li>
                <li>Compte</li>
                <li>Se déconnecter</li>
            </ul>
        </nav>

    </header>
  )
}
