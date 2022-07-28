import React, { useState } from 'react';
import { StatusBar, Dimensions } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import Input from './components/Input';
import Task from './components/Task';
// import AsyncStorage from '@react-native-community/async-storage';
import AppLoading from 'expo-app-loading';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.main};
  width: 100%;
  align-items: flex-end;
  padding: 0 20px;
`;

const List = styled.ScrollView`
  flex: 1;
  width: ${({ width }) => width - 40}px;
`;

export default function App() {
  const width = Dimensions.get('window').width;

  const [newTask,setNewTask] = useState('');
  const [tasks, setTasks] = useState({});

//   const storeData = async tasks => {
//     try {
//       await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
//       setTasks(tasks);
//     } catch (e) {
//       //
//     }
//   };
  const getData = async () => {
    const loadedData = await AsyncStorage.getItem('tasks');
    setTasks(JSON.parse(loadedData || '{}'));
  };
  //추가하기
  const addTask = () => {
    if (newTask.length < 1) {
      return;
    }
    const ID = Date.now().toString();
    const newTaskObject = {
      [ID]: { id: ID, text: newTask, completed: false },
    };
    setNewTask('');
    setTasks({ ...tasks, ...newTaskObject });
  };
  //삭제하기
  //삭제 버튼을 클릭했을 때 항목의 id를 이용하여 task에서 해당 항목을 삭제한다.
  const deleteTask = id => {
    const currentTasks = Object.assign({}, tasks);
    delete currentTasks[id];
    setTasks(currentTasks);
  };
  //완료하기
  const toggleTask = id => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[id]['completed'] = !currentTasks[id]['completed'];
    setTasks(currentTasks);
  };
  //수정기능
  const updateTask = item => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[item.id] = item;
    setTasks(currentTasks);
  };
  //입력취소하기
  const onBlur = () => {
    setNewTask('');
  };

  const [isReady, setIsReady] = useState(false);
  return isReady ? (
    <ThemeProvider theme={theme}>
      <Container>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.background}
        />
        <Title>TODO List</Title>
        <Input
          placeholder="+ Add a Task"
          value={newTask}
          onChangeText={text => setNewTask(text)}
          onSubmitEditing={addTask}
          onBlur={onBlur}
        //   onBlur={() => setNewTask('')}
        />
        <List width={width}>
          {Object.values(tasks)
            .reverse()
            .map(item => (
              <Task
                key={item.id}
                item={item}
                deleteTask={deleteTask}
                toggleTask={toggleTask}
                updateTask={updateTask}
              />
            ))}
        </List>
      </Container>
    </ThemeProvider>
  ) : (
    <AppLoading
      startAsync={getData}
      onFinish={() => setIsReady(true)}
      onError={() => {}}
    />
  );
}