import { NavLink } from 'react-router-dom'
import { navItems } from '../data/mockData'

const Sidebar = () => {
  return (
    <nav className="sidebar" aria-label="Navegação principal">
      <div className="brand">
        <span>BotFinance</span>
      </div>
      <ul className="nav-links">
        {navItems.map((item) => (
          <li className="nav-item" key={item.route}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
              end={item.path === '/'}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Sidebar
