// import { MarkupComponent } from '../markup-component';
//
// export class Spinner extends MarkupComponent {
//
//   public active: boolean;
//
//   constructor(message: any) {
//       super('spinner');
//       this.active = message.active;
//     }
//
//   public render(container: any) {
//       const link = document.createElement('div');
//       link.setAttribute('class', 'spinner');
//       link.classList.add('spinner');
//       const child1 = document.createElement('div');
//       child1.setAttribute('class', 'bounce1');
//       const child2 = document.createElement('div');
//       child2.setAttribute('class', 'bounce3');
//       const child3 = document.createElement('div');
//       child3.setAttribute('class', 'bounce3');
//       link.appendChild(child1);
//       link.appendChild(child2);
//       link.appendChild(child3);
//       container.appendChild(link);
//     }
//
//     private scrollToTop(){
//         setTimeout(function () {
//             var element = document.getElementsByClassName("scrollbar")[0];
//             element.scrollTop = element.scrollHeight - element.clientHeight;
//         }, 100);
//     }
//
// }
