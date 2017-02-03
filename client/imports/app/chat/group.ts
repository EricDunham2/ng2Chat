export interface GroupInterface {
    grpID: number;
    Groupname: string;
    Channels: any[];
}

/*    <button class="group-dropdown" *ngFor="let group of groups" data-toggle="collapse" [attr.data-target]="'#' + group.grpID"><span>{{group.Groupname}}</span></button>
    <div id="{{group.grpID}}" *ngFor="let channel of {{group.Channels}}" class="collapse">
      <button class="channel-button" id="{{channel.chnnlID}}">{{channel.Channelname}}</button>  
    </div>*/