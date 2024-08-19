import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <Image height={130} width={130} alt='logo' src='/logo.svg' />
  )
}

export default Logo