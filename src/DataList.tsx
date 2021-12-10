import React, { useRef } from 'react'
import { Animated, StyleSheet, LayoutChangeEvent } from 'react-native'
import * as faker from 'faker'

import { ListItem } from './ListItem'
import { Data } from './types'

const data: Data[] = Array.from({ length: 20 }).map(() => ({
  key: faker.random.alphaNumeric(),
  name: faker.name.findName(),
  job: faker.name.jobTitle(),
  email: faker.internet.email(),
  avatar: 'https://i.pravatar.cc/64', // faker.image.avatar(),
}))

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 48,
  },
})

export const DataList = () => {
  /* A variable for FlatList scroll position */
  const scrollY = useRef(new Animated.Value(0)).current

  /* An object for FlatList layout dimensions. We will need height later. */
  const layout = useRef({ width: 0, height: 0 }).current

  const keyExtractor = (item: Data) => item.key

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event?.nativeEvent?.layout
    layout.width = width
    layout.height = height
  }

  /* Set Animated value here (magic) */
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  )

  const renderItem = ({ item, index }) => (
    <ListItem {...{ item, index, scrollY, layout }} />
  )

  return (
    <Animated.FlatList
      {...{
        data,
        keyExtractor,
        renderItem,
        style: styles.container,
        onScroll,
        onLayout,
      }}
    />
  )
}
