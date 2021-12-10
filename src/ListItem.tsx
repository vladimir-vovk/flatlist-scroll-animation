import React from 'react'
import {
  Text,
  StyleSheet,
  View,
  Image,
  Animated,
  useWindowDimensions,
} from 'react-native'
import { Data } from './types'

const HEIGHT = 96

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    height: HEIGHT,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 4,
  },
  job: {
    fontSize: 16,
  },
})

type Props = {
  item: Data
  index: number
  scrollY: Animated.Value
  layout: {
    width: number
    height: number
  }
}

export const ListItem = ({ item, index, scrollY, layout }: Props) => {
  const { width } = useWindowDimensions()
  const { avatar, name, job } = item
  /* Starting the animation when item at the top (scrollY === HEIGHT * index).
     Continue the animation until next item (current item fully hidden).
   */
  const inputRange = [-1, 0, HEIGHT * index, HEIGHT * (index + 1)]

  const opacity = scrollY.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0],
  })
  const scaleY = scrollY.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0.8],
    extrapolateLeft: 'clamp',
  })
  const translateX = scrollY.interpolate({
    inputRange,
    outputRange: [1, 1, 0, width / 10],
    extrapolateLeft: 'clamp',
  })

  /* Start the animation when the item toches the bottom edge */
  const bottomInputRange = [
    HEIGHT * (index - 1) - layout.height,
    HEIGHT * index - layout.height,
    HEIGHT * (index + 1) - layout.height,
  ]

  const bottomTranslateX = scrollY.interpolate({
    inputRange: bottomInputRange,
    outputRange: [width / 10, width / 10, 0],
    extrapolateRight: 'clamp',
  })

  const bottomOpacity = scrollY.interpolate({
    inputRange: bottomInputRange,
    outputRange: [0, 0, 1],
    extrapolateRight: 'clamp',
  })

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: Animated.multiply(opacity, bottomOpacity),
          transform: [
            { scaleY },
            { translateX },
            { translateX: bottomTranslateX },
          ],
        },
      ]}
    >
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.job}>{job}</Text>
      </View>
    </Animated.View>
  )
}
