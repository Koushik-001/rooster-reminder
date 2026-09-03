
import { ArrowDown, ArrowDownNarrowWide, ChevronRight, Clock, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Calendar } from 'react-native-calendars';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { usePathname, useRouter } from "expo-router";
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
  const pathname = usePathname();
  const router = useRouter();

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
      <View className='absolute top-[90vh] items-center w-full items-center'>
        <View className='bg-[#1c242f] rounded-full p-3 w-[50%] justify-between flex-row'>
          <Pressable onPress={() => { router.push('/home') }} className={pathname === '/home' ? 'bg-white text-black p-2 rounded-full' : 'text-white p-2'}><Text className={pathname === '/home' ? 'text-black' : 'text-white'}>Home</Text></Pressable>
          <Pressable onPress={() => { router.push('/calendar') }} className={pathname === '/calendar' ? 'bg-white text-black p-2 rounded-full' : 'text-white p-2'}><Text className={pathname === '/calendar' ? 'text-black' : 'text-white'}>Calendar</Text></Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = {
  container: `items-center flex-1 bg-white`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
