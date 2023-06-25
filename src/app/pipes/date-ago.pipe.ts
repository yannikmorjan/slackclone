import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dateAgo',
    pure: true
})
export class DateAgoPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
            if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
                return 'vor wenigen Sekunden';
            const intervals = {
                'Jahr': 31536000,
                'Monat': 2592000,
                'Woche': 604800,
                'Tag': 86400,
                'Stunde': 3600,
                'Minute': 60,
                'Sekunde': 1
            };
            let counter;
            for (const i in intervals) {
                counter = Math.floor(seconds / intervals[i]);
                if (counter > 0)
                    if (counter === 1) {
                        return 'vor ' + counter + ' ' + i;
                    } else if(counter > 1 && (i == 'Jahr' || i == 'Monat' || i == 'Tag')) {
                        return 'vor ' + counter + ' ' + i + 'en'; 
                    } else if(counter > 1 && (i == 'Woche' || i == 'Minute' || i == 'Sekunde' || i == 'Stunde')) {
                      return 'vor ' + counter + ' ' + i + 'n';
                  }
            }
        }
        return value;
    }

}

// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'dateAgo',
//   pure: true
// })
// export class DateAgoPipe implements PipeTransform {

//   transform(value: any, args?: any): any {
//     if (value) {
//       let formattedValue;
//       if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{1}$/)) {
//         // Convert value from 'yyyy-mm-d' format to a timestamp format
//         formattedValue = new Date(value).getTime();
//       } else if (typeof value === 'number' || (typeof value === 'string' && !isNaN(+value))) {
//         // If value is a number or a string that can be parsed to a number, treat it as a timestamp
//         formattedValue = +value;
//       } else {
//         // If the value format is invalid or unsupported, return the original value
//         return value;
//       }

//       const seconds = Math.floor((+new Date() - formattedValue) / 1000);
//       if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
//         return 'vor wenigen Sekunden';
//       const intervals = {
//         'Jahr': 31536000,
//         'Monat': 2592000,
//         'Woche': 604800,
//         'Tag': 86400,
//         'Stunde': 3600,
//         'Minute': 60,
//         'Sekunde': 1
//       };
//       let counter;
//       for (const i in intervals) {
//         counter = Math.floor(seconds / intervals[i]);
//         if (counter > 0)
//           if (counter === 1) {
//             return 'vor ' + counter + ' ' + i;
//           } else if (counter > 1 && (i == 'Jahr' || i == 'Monat' || i == 'Tag')) {
//             return 'vor ' + counter + ' ' + i + 'en';
//           } else if (counter > 1 && (i == 'Woche' || i == 'Minute' || i == 'Sekunde' || i == 'Stunde')) {
//             return 'vor ' + counter + ' ' + i + 'n';
//           }
//       }
//     }
//     return value;
//   }
// }


// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'dateAgo',
//   pure: true
// })
// export class DateAgoPipe implements PipeTransform {

//   transform(value: any, args?: any): any {
//     if (value) {
//       let formattedValue;
//       if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
//         // Convert value from 'yyyy-mm-dd' format to a timestamp format
//         formattedValue = new Date(value).getTime();
//       } else if (typeof value === 'number' || (typeof value === 'string' && !isNaN(+value))) {
//         // If value is a number or a string that can be parsed to a number, treat it as a timestamp
//         formattedValue = +value;
//       } else {
//         // If the value format is invalid or unsupported, return the original value
//         return value;
//       }

//       const seconds = Math.floor((+new Date() - formattedValue) / 1000);
//       if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
//         return 'vor wenigen Sekunden';
//       const intervals = {
//         'Jahr': 31536000,
//         'Monat': 2592000,
//         'Woche': 604800,
//         'Tag': 86400,
//         'Stunde': 3600,
//         'Minute': 60,
//         'Sekunde': 1
//       };
//       let counter;
//       for (const i in intervals) {
//         counter = Math.floor(seconds / intervals[i]);
//         if (counter > 0)
//           if (counter === 1) {
//             return 'vor ' + counter + ' ' + i;
//           } else if (counter > 1 && (i == 'Jahr' || i == 'Monat' || i == 'Tag')) {
//             return 'vor ' + counter + ' ' + i + 'en';
//           } else if (counter > 1 && (i == 'Woche' || i == 'Minute' || i == 'Sekunde' || i == 'Stunde')) {
//             return 'vor ' + counter + ' ' + i + 'n';
//           }
//       }
//     }
//     return value;
//   }
// }

