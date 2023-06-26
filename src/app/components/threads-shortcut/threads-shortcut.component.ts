import { ChannelService } from 'src/app/services/channel.service';
import { UsersService } from 'src/app/services/users.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Component } from '@angular/core';
import { Thread } from 'src/app/models/thread.class';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-threads-shortcut',
  templateUrl: './threads-shortcut.component.html',
  styleUrls: ['./threads-shortcut.component.scss']
})
export class ThreadsShortcutComponent {
  currentUserId: string;
  currentUserData: any = [];
  allThreads: Thread[] = [];
  threadsFromCurrentUser: Thread[] = [];
  names: any = [];
  // observerThreadList: Observable<any>;
  allUser: any = [];
  reply: any = [];

  constructor(
    public firestoreService: FirestoreService,
    public usersService: UsersService,
    public channelService: ChannelService
  ) {
    // this.observerThreadList = this.firestoreService.getThreadList();
    // this.observerThreadList.subscribe((threads) => {
    //   this.channelService.threadList = threads;
    //   console.log('What I get here', this.channelService.threadList);
    //   // updateThreads
    // });
  }

  async ngOnInit(): Promise<void> {
    await this.getAllThreads();
  }

  async getAllThreads() {
    this.allThreads = await this.firestoreService.getAllThreads();
    // console.log('Threadslist comes from the thread-shortcut component:', this.allThreads);
    this.getCurrentUserData();
    this.getCurrentUserId();
    this.getThreadsFromCurrentUser();
  }

  getCurrentUserId() {
    this.currentUserId = this.usersService.currentUserId$;
    // console.log('Current User Id comes from the thread-shortcut component', this.currentUserId);
  }

  async getCurrentUserData() {
    this.currentUserData = await this.usersService.getCurrentUserData();
    // console.log('Current user data comes from the thread-shortcut component', this.currentUserData);
  }

  async getThreadsFromCurrentUser() {
    for (let i = 0; i < this.allThreads.length; i++) {
      if (this.allThreads[i]['user'] == this.currentUserId) {
        this.threadsFromCurrentUser.push(this.allThreads[i]);
      }
    }
    this.getNameOfReply();
    // console.log('Threads from current User', this.threadsFromCurrentUser);
  }

  async getAllUser() {
    await this.firestoreService.getAllUsers().then((users) => {
      // console.log('All Users', users);
      this.allUser = users;
    });
  }

  async getNameOfReply() {
    await this.getAllUser();
    console.log('All User Liste:', this.allUser);

    for (let i = 0; i < this.threadsFromCurrentUser.length; i++) {
      this.reply = this.threadsFromCurrentUser[i].replies;
      console.log('Reply', this.reply);
      console.log('Reply length:', this.reply.length);
      for (let n = 0; n < this.reply.length; n++) {
        for (let j = 0; j < this.allUser.length; j++) {
          if (this.reply[n].user == this.allUser[j].uid) {
            console.log('reply[n]', this.reply[n]);
            console.log('allUser[j]', this.allUser[j]);
            this.extensionUser(n, j);
          }
        }
      }
    }
  }

  extensionUser(n: number, j: number) {
    this.channelService.setUserDataInThreads(
      this.reply[n],
      this.allUser[j]
    );
  }
}