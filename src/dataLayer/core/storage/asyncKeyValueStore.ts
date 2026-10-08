import AsyncStorage from '@react-native-async-storage/async-storage';
import { createKeyValueStore, type KeyValueStore } from './keyValueStore';

export const asyncKeyValueStore: KeyValueStore = createKeyValueStore(AsyncStorage);
