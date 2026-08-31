
import {User} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Calendar } from 'react-native-calendars';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOutUp } from 'react-native-reanimated';


interface ScreenContentProps {
  title: string;
  path: string;
  children?: React.ReactNode;
}

export const ScreenContent: React.FC<ScreenContentProps> = ({ title, path, children }) => {
  const today = new Date();
  const date = today.getDate();
  const month = today.toLocaleString('default', { month: 'long' });
  const [calendarClicked, setcalendarClicked] = useState(false);

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
      <View className='absolute top-[90vh] left-[45vw] items-center'>
        <Text>nav bar</Text>
      </View>
    </View>
  );
};

const styles = {
  container: `items-center flex-1 bg-white`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
