import { EventEmitter, Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Chat } from '../models/chat.class';
import { UsersService } from './users.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chat = new Chat();
  chatOpen: boolean = false;
  chatReady: boolean = false;
  chatList: Array<any> = [];
  personalChatList: Array<any> = [];
  userList: Array<any> = [];
  dateList: Array<any> = [];
  chatPartnerList: Array<any> = [];
  activeChatPartnerList: Array<any> = [];
  chatHistory: Array<any> = [];
  chatPartner: any;
  scrollStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public firestoreService: FirestoreService,
    public userService: UsersService,
    public globalService: GlobalService
  ) {}

  /**
   * open the chat component and load the chat content
   * @param chatPartner - the user to open a chat with
   */
  async openChat(chatPartner: string) {
    this.chatPartner = chatPartner;
    await this.loadChatListFromFirestore();
    if (!this.checkIfChatExists(this.chatPartner)) {
      await this.addNewChat(this.chatPartner);
    }
    this.checkIfChatExists(this.chatPartner);
    this.loadChatContent();
    this.chatOpen = true;
  }

  /**
   * load the chat list from firestore.service
   */
  async loadChatListFromFirestore() {
    await this.firestoreService.getAllChats().then(() => {
      this.chatList = this.firestoreService.chatList;
    });
  }

  async loadPersonalChatList(userID: string) {
    await this.loadChatListFromFirestore();
    this.chatList.forEach((chat) => {
      if (chat.chatUsers[0] == userID) {
        this.personalChatList.push(chat);
      }
    });
    return this.personalChatList;
  }

  /**
   * check if a chat with the chatPartner already exists
   * @param chatPartner - the user to open a chat with
   * @returns - true if chat exists, false if not
   */
  checkIfChatExists(chatPartner: string) {
    for (let chat of this.chatList) {
      if (
        chat.chatUsers.includes(this.userService.currentUserId$) &&
        chat.chatUsers.includes(chatPartner)
      ) {
        this.chat = chat;
        return true;
      }
    }
    return false;
  }

  /**
   * add a new chat with the chatPartner and upload it to firestore
   * @param chatPartner - the user to open a chat with
   */
  async addNewChat(chatPartner: string) {
    this.chat = {
      chat: [],
      chatId: '',
      chatUsers: [this.userService.currentUserId$, chatPartner],
    };
    await this.firestoreService.addNewChat(this.chat);
    await this.loadChatListFromFirestore();
    this.checkIfChatExists(chatPartner);
  }

  /**
   * load the chat content from firestore.service
   * @param chatPartner - the user to open a chat with
   */
  async loadChatContent() {
    this.chatReady = false;
    await this.firestoreService.getAllUsers().then(() => {
      this.userList = this.firestoreService.usersList;
    });
    this.setChatHistory();
    this.findDates();
    this.setUserInChatHistory();
    this.setChatPartnerList();
    this.editChatPartnerList();
    setTimeout(() => {
      this.scrollStatus.emit(false);
    }, 10);
    this.chatReady = true;
    console.log(this.activeChatPartnerList);
  }

  /**
   * update the chat content after a new message was sent
   */
  updateChatContent() {
    this.checkIfChatExists(this.chatPartner);
    this.setChatHistory();
    this.findDates();
    this.setUserInChatHistory();
    this.setChatPartnerList();
    this.editChatPartnerList();
  }

  /**
   * set the chat history from the chat object
   */
  setChatHistory() {
    this.chatHistory = [];
    this.chat.chat.forEach((element?: any) => {
      this.chatHistory.push(element);
    });
  }

  /**
   * find all dates in the chat history and sort them to a unique list
   */
  findDates() {
    this.dateList = [];
    this.chatHistory.forEach((element?: any) => {
      this.dateList.push(element.date);
    });
    this.dateList = this.globalService.uniqueList(this.dateList);
    this.dateList = this.globalService.sortingDateList(this.dateList);
  }

  /**
   * set the user data in the chat history
   */
  setUserInChatHistory() {
    if (this.chatHistory.length > 0) {
      this.chatHistory.forEach((chat: any) => {
        this.userList.forEach((user: any) => {
          if (chat.user === user.id) {
            this.setUserDataInChat(chat, user);
          }
        });
      });
    }
  }

  /**
   * set the user data in the chat object
   * @param chat - the chat object to set the user data in
   * @param user - the user object to get the data from
   */
  setUserDataInChat(chat: any, user: any) {
    chat.user = {
      id: user.id,
      name: user.displayName,
      image: user.photoURL
        ? user.photoURL
        : 'assets/img/threads/profile-picture.png',
      email: user.email,
    };
  }

  /**
   * set the chat partner list from the chat object
   */
  setChatPartnerList() {
    this.chatPartnerList = [];
    for (let user of this.chat.chatUsers) {
      this.chatPartnerList.push(user);
    }
  }

  /**
   * edit the chat partner list to a unique list and remove the current user
   */
  editChatPartnerList() {
    this.chatPartnerList = this.globalService.uniqueList(this.chatPartnerList);
    this.chatPartnerList = this.chatPartnerList.filter(
      (user: any) => user !== this.userService.currentUserId$
    );

    this.chatPartnerList.forEach((user: any) => {
      this.userList.forEach((userData: any) => {
        if (user === userData.id) {
          this.setActiveChatPartnerList(userData);
        }
      });
    });
  }

  /**
   * push the user data in the active chat partner list
   * @param userList - the user object to set the data in the active chat partner list
   */
  setActiveChatPartnerList(userList: any) {
    this.activeChatPartnerList = [];
    let chatPartner = {
      id: userList.id,
      name: userList.displayName,
      image: userList.photoURL
        ? userList.photoURL
        : 'assets/img/threads/profile-picture.png',
      email: userList.email,
    };
    this.activeChatPartnerList.push(chatPartner);
  }

  /**
   * send a chat message - update chat in firestore
   * @param content - the content of the chat message
   */
  sendChatMessage(content: string) {
    const user = this.userService.currentUserId$;
    const message = content;
    console.log(this.chat, user, message);

    this.firestoreService
      .addChatMessage(this.chat.chatId, user, message)
      .then(() => {
        this.scrollStatus.emit(true);
      });
  }
}
