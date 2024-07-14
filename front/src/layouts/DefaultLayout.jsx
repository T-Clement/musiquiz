import React from 'react'
import { Outlet } from 'react-router-dom'

function DefaultLayout() {
  return (
    <>
    <p>DefaultLayout</p>
    <Outlet/>
    </>
  )
}

export default DefaultLayout