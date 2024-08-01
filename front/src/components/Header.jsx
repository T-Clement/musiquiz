import React from 'react'

export function Header() {
  return (
    <header className='flex'>
        
        <h1 className='me-auto'>Musiquiz</h1>


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
