
import { User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Calendar } from 'react-native-calendars';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { usePathname, useRouter } from "expo-router";


interface HomePageProps {
  title: string;
  path: string;
  children?: React.ReactNode;
}

export const HomePage: React.FC<HomePageProps> = ({ title, path, children }) => {
  const today = new Date();
  const date = today.getDate();
  const month = today.toLocaleString('default', { month: 'long' });
  const [calendarClicked, setcalendarClicked] = useState(false);
  // const pathname = usePathname();
  // const router = useRouter();
  // console.log(pathname, 'name');
  return (
    <View className="bg-white flex-1 pt-[5vh]">
      <View className='flex-row px-5 justify-between'>
        <Pressable
          onPress={() => setcalendarClicked(!calendarClicked)}
          className="active:scale-110 transition-all"
        >
          <Text className="bg-white p-3 rounded-lg shadow-xl">
            {month} {date}
          </Text>
        </Pressable>

        {/* <Pressable className="bg-white rounded-full p-3">
          <User size={24} color="black" />
        </Pressable> */}
        {/* <User size={24} color="black" /> */}


      </View>
      {calendarClicked ?
        <Animated.View
          entering={FadeInUp.duration(500)} exiting={FadeOutUp.duration(500)}>
          <View className='border border-black-100/30 rounded-lg p-2 m-5 top-[5vh]' ><Calendar enableSwipeMonths /></View>
        </Animated.View>
        : ""}
      <View className='absolute top-[90vh] items-center w-full items-center'>
        <View className='border border-black-500 rounded-3xl p-3 w-[50%] justify-between flex-row'>
          <Pressable className='bg-red-500 active:bg-black'><Text >nav bar</Text></Pressable>
          <Text>nav bar</Text>
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
