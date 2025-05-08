import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-root',
  template: `
    <header>
      <h1>E-Commerce App</h1>
      <nav>
        <a routerLink="/">Home</a>
        <a routerLink="/cart">Cart</a>
      </nav>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    header {
      background: #3f51b5;
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h1 {
        margin: 0;
        font-size: 1.5rem;
      }
      
      nav a {
        color: white;
        margin-left: 1rem;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
    
    main {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {}