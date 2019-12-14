import React, { FC, useState } from 'react'
import { RouteComponentProps } from '@reach/router'
import { uniqueId } from 'lodash-es'

import CardPile from '../components/CardPile'

import { Card as CardType } from '../types/Card'
import { useEffect } from 'react'

export interface DemoProps extends RouteComponentProps {}

const Demo: FC<DemoProps> = () => {
  const [cards, setCards] = useState<
    {
      type: CardType
      id: string
    }[]
  >([{ type: CardType.FOX, id: '00' }])

  useEffect(() => {
    setInterval(() => {
      setCards(cards => [
        ...cards,
        {
          type: Math.floor(Math.random() * 3),
          id: uniqueId()
        }
      ])
    }, 2000)
  }, [])

  return (
    <>
      <CardPile cards={cards} />
    </>
  )
}

export default Demo
