import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements AfterViewInit {
  constructor(public channelService: ChannelService) {}

  ngAfterViewInit(): void {
    this.channelService.loadChannelContent('#anderer_musterchannel');
  }
}
