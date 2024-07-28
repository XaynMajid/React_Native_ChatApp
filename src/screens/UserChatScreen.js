import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import EntypoIcon from "react-native-vector-icons/Entypo";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
const UserChatScreen = () => {
  const flatListRef = useRef(null);
  useEffect(() => {
// const Timer = setTimeout(() => {
  ScrollToBottom();
// }, 100);
// return ()=> clearTimeout(Timer)
  }, [messagesArr]);
  const ScrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: false });
    }
  };
const HandleSizeChange = ()=>{
  ScrollToBottom()
} 
  const route = useRoute();
  const { recipientId } = route.params;
  const { userId, setUserId } = useContext(UserType);
  const [emojiVal, setEmojiVal] = useState(false);
  const [messageVal, setMessageVal] = useState("");
  const [messagesArr, setMessagesArr] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [recipientData, setRecipientData] = useState("");

  const navigation = useNavigation();
  const emojiHandler = () => {
    setEmojiVal(!emojiVal);
  };
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  console.log("messages", selectedMessages);

  // Function Displaying Recipient data
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () =>
        selectedMessages.length > 0 ? (
          <Text style={{ ...tw`text-black ml-14`, marginHorizontal: 10 }}>
            {selectedMessages.length}
          </Text>
        ) : (
          recipientData && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IoniconsIcon
                name="arrow-back-sharp"
                size={20}
                style={tw`text-black mr-4`}
                onPress={() => navigation.goBack()}
              />

              <Image
                source={{ uri: recipientData?.image }}
                style={{ ...tw`h-12 w-12`, borderRadius: 50 }}
              />
              <Text style={tw`text-black ml-2 text-lg`}>
                {recipientData.name}
              </Text>
            </View>
          )
        ),

      headerRight: () => {
        // console.log("headerRight function called");
        // console.log("selectedMessages length:", selectedMessages.length);

        return selectedMessages.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              deleteMessages(selectedMessages);
            }}
          >
            <FontAwesome5
              name="trash-restore"
              size={20}
              style={{ ...tw`text-black` }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <FontAwesome5
              name="trash-restore"
              size={20}
              style={{ ...tw`text-gray-300` }}
            />
          </TouchableOpacity>
        );
      },
    });
  }, [recipientData, selectedMessages, navigation]);
  const deleteMessages = async (messages) => {
    ReactNativeHapticFeedback.trigger("impactLight", options);
    console.log("In Delete", messages);
    try {
      let res = await fetch("http://localhost:8163/deleteMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messages }),
      });
      if (res) {
        // selectedMessages("")
        console.log("in res");

        setSelectedMessages((val) =>
          val.filter((id) => !messages.includes(id))
        );
        getMessages();
      }
    } catch (error) {
      console.log(error, "hi");
    }
  };

  // RecipientData Finding  Function For Profile Pic in Header (Navigation)

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:8163/user/find/${recipientId}`
        );
        const data = await res.json();
        setRecipientData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
    // setSentTimeOfMessage(messagesArr[messagesArr.length - 1].time)
  }, [recipientId]);

  // Displaying All messaages Function

  const getMessages = async () => {
    try {
      const res = await fetch(
        `http://localhost:8163/messages/${userId}/${recipientId}`
      );
      if (res.ok) {
        const data = await res.json();
        setMessagesArr(data);
      }
    } catch (error) {
      console.log("error while fetching messages", error);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  // Message sending Function

  const handleSend = async (messageType, imageUri) => {
    ReactNativeHapticFeedback.trigger("impactLight", options);

    try {
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recipientId", recipientId);

      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", messageVal);
      }

      const response = await fetch("http://localhost:8163/messages", {
        method: "POST",
        body: formData,
      });

      if (!response.cancel) {
        setMessageVal("");
        setSelectedMessages("");
        getMessages(); // Refresh messages from server
      }
    } catch (error) {
      console.log("internal server error of frontEnd", error);
    }
  };

  ///  Getting time Function
  const getTime = (val) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(val).toLocaleString("en-US", options);
  };

  ///  Gallery opening Function
  const openGallery = async () => {
    ReactNativeHapticFeedback.trigger("impactLight", options);
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 1, // Maximum quality
      // maxWidth: 1024, // Adjust according to your needs
      // maxHeight: 1024, // Adjust according to your needs
    });

    if (result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log(imageUri);
      console.log(result);
      if (imageUri) {
        handleSend("image", imageUri);
      }
    }
  };

  // Message Selection for deletion
  const messageSelected = (message) => {
    ReactNativeHapticFeedback.trigger("impactLight", options);
    const isSelected = selectedMessages.includes(message._id);
    console.log("selected", isSelected);
    if (isSelected) {
      setSelectedMessages((val) => val.filter((_id) => _id !== message._id));
    } else {
      setSelectedMessages([...selectedMessages, message._id]);
    }
  };
  const renderItem = ({ item }) => {
    if (item.messageType === "text") {
      const isSelected = selectedMessages.includes(item._id);
      return (
        <TouchableOpacity
          onLongPress={() => {
            messageSelected(item);
          }}
          style={[
            item?.senderId?._id === userId
              ? {
                  alignSelf: "flex-end",
                  backgroundColor: "#DCF8A3",
                  padding: 10,
                  marginVertical: 8,
                  marginHorizontal: 10,
                  borderRadius: 10,
                }
              : {
                  alignSelf: "flex-start",
                  borderRadius: 10,
                  backgroundColor: "white",
                  padding: 10,
                  marginVertical: 8,
                  marginHorizontal: 10,
                },
            isSelected && { width: "70%", ...tw`bg-gray-300` }, // point
            tw``,
          ]}
        >
          <Text
            style={{
              ...tw`text-black `,
              fontSize: 15,
              textAlign: isSelected ? "right" : "left",
            }}
          >
            {item?.messageText}
          </Text>
          <Text
            style={{
              ...tw`text-gray-400 `,
              marginTop: 1,
              fontSize: 10,
              alignSelf: "flex-end",
            }}
          >
            {getTime(item?.time)}
          </Text>
        </TouchableOpacity>
      );
    }
    if (item.messageType === "image") {
      const baseUri = "http://localhost:8163/uploads/";
      const imageUri = item.imageUrl;
      const filename = imageUri.split(/[\\/]/).pop();
      const source = { uri: baseUri + filename };
      const isSelected = selectedMessages.includes(item._id);

      return (
        <TouchableOpacity
          onLongPress={() => messageSelected(item)}
          style={[
            item?.senderId?._id === userId
              ? {
                  alignSelf: "flex-end",
                  backgroundColor: "#DCF8A3",
                  padding: 10,
                  marginVertical: 8,
                  marginHorizontal: 10,
                  borderRadius: 10,
                }
              : {
                  alignSelf: "flex-start",
                  borderRadius: 10,
                  backgroundColor: "white",
                  padding: 10,
                  marginVertical: 8,
                  marginHorizontal: 10,
                },
            isSelected && { ...tw`bg-gray-300`, width: "70%" },
          ]}
        >
          <View style={{ ...tw`relative` }}>
            <Image
              source={source}
              style={{
                height: 180,
                width: 180,
                borderRadius: 4,
                alignSelf: isSelected ? "flex-end" : "center",
              }}
            />
            <Text
              style={{
                ...tw`text-white  absolute bottom-1 right-2`,
                fontSize: 10,
              }}
            >
              {getTime(item?.time)}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <KeyboardAvoidingView style={{ ...tw``, flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={messagesArr}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{flexGrow:1}}
        onContentSizeChange={()=>ScrollToBottom()}
      />

      <View
        style={{
          ...tw`flex-row items-center  `,
          borderTopColor: "black",
          borderTopWidth: 1,
          paddingVertical: emojiVal ? 0 : 15,
        }}
      >
        <EntypoIcon
          name="emoji-happy"
          size={30}
          style={{ ...tw`text-gray-400 mr-1 ml-2 ` }}
          onPress={() => emojiHandler()}
        />
        <TextInput
          style={{
            ...tw`border-gray-300 px-7 flex-1 text-black`,
            borderWidth: 2,
            borderRadius: 20,
            height: 40,
          }}
          placeholder="Type Your Message..."
          placeholderTextColor={"lightgray"}
          onChangeText={(text) => {
            setMessageVal(text);
          }}
          value={messageVal}
        />

        <View
          style={{
            ...tw`flex-row items-center ml-5`,
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <TouchableOpacity onPress={() => openGallery()}>
            <EntypoIcon
              name="camera"
              size={30}
              style={{ ...tw`text-gray-400` }}
            />
          </TouchableOpacity>

          <FontAwesomeIcon
            name="microphone"
            size={30}
            style={{ ...tw`text-gray-400` }}
          />
          <TouchableOpacity
            style={{ ...tw`font-bold   rounded-full ` }}
            onPress={() => {
              handleSend("text");
            }}
          >
            <Text
              style={{ ...tw`text-white bg-blue-600 px-6 py-3 rounded-full ` }}
            >
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {emojiVal && (
        <EmojiSelector
          onEmojiSelected={(emoji) => setMessageVal((prev) => prev + emoji)}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default UserChatScreen;
