import AsyncStorage from '@react-native-async-storage/async-storage';

function setData(key, value) {
  AsyncStorage.setItem(`@${key}`, value)
  .then(() => {
  })
  .catch(e => console.log(e));
}

async function getData(key) {
  try {
    const data = await AsyncStorage.getItem(`@${key}`);
    return JSON.parse(data);
  } catch (e) {
    console.log(e)
    return [];
  }
}

async function checkInKeys(key) {
  try {
    const keys = await AsyncStorage.getAllKeys()
    return keys.includes(`@${key}`);
  } catch (e) {
    console.log(e);
    return false;
  }
}

export {setData, getData, checkInKeys};

