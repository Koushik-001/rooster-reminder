
import { ArrowDown, ArrowDownNarrowWide, ChevronRight, Clock, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Calendar } from 'react-native-calendars';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { Image } from 'react-native';


interface HomePageProps {
  title: string;
  path: string;
  children?: React.ReactNode;
}

export const HomePage: React.FC<HomePageProps> = () => {
  const today = new Date();
  const date = today.getDate();
  const month = today.toLocaleString('default', { month: 'long' });
  const [calendarClicked, setcalendarClicked] = useState(false);
  return (
    <View className="bg-[#060d15] flex-1 pt-[5vh]">
      <View className='flex-row px-5 justify-between'>
        <Pressable
          onPress={() => setcalendarClicked(!calendarClicked)}
          className="active:scale-110 transition-all bg-transparent p-2 rounded-xl"
        >
          <Text className='bg-[#1c242f] p-2 rounded-xl text-white'>
            {month} {date} <ArrowDown color={"white"} size={10} />
          </Text>
        </Pressable>

        <User size={24} color="white" />



      </View>
      <Image source={require('../assets/notepad.png')} className='w-full h-[40%] absolute top-[20%]' />

      <View className='absolute top-[70%] w-[90%] ml-[5%] bg-[#1c242f] p-5 rounded-lg'>
        <Pressable className='flex-row justify-between items-center mb-5'>
          <Text className='text-white'><Clock color={"white"} /> Time</Text>
          <Text className='text-white text-xl'>Time <ChevronRight color={"white"} size={15}/></Text>
        </Pressable>

        <View className="h-[1px] bg-white/20 mb-5" />

        <Pressable className='flex-row justify-between items-center'>
          <Text className='text-white'><Clock color={"white"} /> Time</Text>
          <Text className='text-white text-xl'>Time <ChevronRight color={"white"} size={15}/></Text>
        </Pressable>
      </View>

      {calendarClicked ?
        <Animated.View
          entering={FadeInUp.duration(500)} exiting={FadeOutUp.duration(500)}>
          <View className='border border-black-100/30 rounded-lg p-2 m-5 top-[5vh]' ><Calendar enableSwipeMonths /></View>
        </Animated.View>
        : ""}
    </View>
  );
};

const styles = {
  container: `items-center flex-1 bg-white`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
