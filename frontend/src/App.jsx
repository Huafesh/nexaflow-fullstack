import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { BrowserRouter as Router, Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Home,
  LayoutDashboard,
  Loader2,
  Menu,
  Moon,
  Package,
  Rocket,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  UserPlus,
  Users,
  Workflow,
  X,
  Zap,
} from 'lucide-react';

import TaskList from './TaskList';
import SimpleForm from './SimpleForm';
import UserList from './UserList';
import CustomCursor from './CustomCursor';
import InteractiveSurface from './InteractiveSurface';
import Reveal, { RevealGroup } from './Reveal';
import SmoothScrollProvider from './SmoothScrollProvider';
import WorkspaceVisual from './WorkspaceVisual';
import InteractiveBubbles from './InteractiveBubbles';
import nexaFlowMark from './assets/nexaflow-mark.svg';
import { useSmoothScroll } from './smoothScrollContext';

const navigation = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/productos', label: 'Productos', icon: Package },
  { to: '/landing', label: 'Landing', icon: Rocket },
  { to: '/tareas', label: 'Tareas', icon: ClipboardList },
  { to: '/formulario', label: 'Registro', icon: UserPlus },
  { to: '/usuarios', label: 'Usuarios', icon: Users },
];

const metrics = [
  { label: 'Tareas resueltas', value: '1,284', icon: CheckCircle2 },
  { label: 'Equipos activos', value: '18', icon: Users },
  { label: 'Tiempo ahorrado', value: '42h', icon: Zap },
];

const productCards = [
  {
    icon: LayoutDashboard,
    title: 'Panel operativo',
    text: 'Controla prioridades, entregas y avance desde una vista clara para todo el equipo.',
  },
  {
    icon: Workflow,
    title: 'Flujos automatizados',
    text: 'Convierte registros, clientes y tareas en procesos visibles y faciles de seguir.',
  },
  {
    icon: BarChart3,
    title: 'Analitica accionable',
    text: 'Revisa indicadores clave sin hojas dispersas ni reportes manuales.',
  },
];

const plans = [
  { name: 'Starter', price: '$19', detail: 'Para equipos pequenos que quieren ordenar su trabajo diario.' },
  { name: 'Growth', price: '$49', detail: 'Para operaciones con mas volumen, seguimiento y colaboracion.' },
  { name: 'Scale', price: '$99', detail: 'Para empresas que necesitan control, seguridad y reportes.' },
];

const benefits = [
  'Vista unica para tareas, personas y productos.',
  'Estados claros para saber que sigue en cada flujo.',
  'Interfaz rapida, responsiva y lista para presentarse.',
];

const themeColors = {
  light: '#f5f7fb',
  dark: '#111318',
};

function getInitialTheme() {
  const savedTheme = localStorage.getItem('nexaflow-theme');

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function MetricCard({ metric }) {
  const Icon = metric.icon;

  return (
    <InteractiveSurface as="article" className="metric-card" variant="card">
      <Icon aria-hidden="true" />
      <div>
        <strong>{metric.value}</strong>
        <span>{metric.label}</span>
      </div>
    </InteractiveSurface>
  );
}

function Inicio() {
  return (
    <section className="page">
      <div className="hero-grid">
        <Reveal className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            Plataforma de productividad
          </span>
          <h1>Gestiona tareas, registros y equipos con una experiencia impecable.</h1>
          <p>
            NexaFlow convierte una app React sencilla en un espacio profesional para organizar
            trabajo, presentar soluciones y consultar informacion clave.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/tareas">
              <ClipboardList size={18} aria-hidden="true" />
              Ver tareas
            </Link>
            <Link className="btn btn-secondary" to="/productos">
              <Package size={18} aria-hidden="true" />
              Explorar productos
            </Link>
          </div>
        </Reveal>

        <Reveal
          as={InteractiveSurface}
          className="preview-panel"
          aria-label="Vista previa de NexaFlow"
          delay={90}
          surfaceVariant="panel"
        >
          <div className="panel-heading">
            <div>
              <span>Workspace</span>
              <strong>NexaFlow Ops</strong>
            </div>
            <BadgeCheck size={22} aria-hidden="true" />
          </div>
          <div className="preview-stage">
            <WorkspaceVisual />
          </div>
          <div className="workflow-list">
            {['Brief recibido', 'Tareas asignadas', 'Registro validado'].map((item, index) => (
              <InteractiveSurface as="div" className="workflow-item" key={item} variant="tile">
                <span>{index + 1}</span>
                <p>{item}</p>
                <CheckCircle2 size={18} aria-hidden="true" />
              </InteractiveSurface>
            ))}
          </div>
        </Reveal>
      </div>

      <RevealGroup className="metric-grid" stagger={90}>
        {metrics.map((metric) => (
          <MetricCard metric={metric} key={metric.label} />
        ))}
      </RevealGroup>

      <Reveal className="section-heading" delay={40}>
        <span>Operacion diaria</span>
        <h2>Todo lo importante queda visible y accionable.</h2>
      </Reveal>
      <RevealGroup className="feature-grid" stagger={100}>
        {productCards.map((card) => {
          const Icon = card.icon;

          return (
            <InteractiveSurface as="article" className="feature-card" key={card.title} variant="card">
              <Icon aria-hidden="true" />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </InteractiveSurface>
          );
        })}
      </RevealGroup>
    </section>
  );
}

function Productos() {
  return (
    <section className="page">
      <Reveal className="page-intro">
        <span className="eyebrow">
          <Package size={16} aria-hidden="true" />
          Productos
        </span>
        <h1>Soluciones para ordenar tu operacion sin complicarla.</h1>
        <p>
          Cada modulo esta pensado para que un equipo pueda avanzar, medir y colaborar sin perder
          contexto.
        </p>
      </Reveal>

      <RevealGroup className="feature-grid" stagger={100}>
        {productCards.map((card) => {
          const Icon = card.icon;

          return (
            <InteractiveSurface
              as="article"
              className="feature-card elevated"
              key={card.title}
              variant="card"
            >
              <Icon aria-hidden="true" />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <a href="#planes" className="text-link">
                Ver planes <ArrowRight size={16} aria-hidden="true" />
              </a>
            </InteractiveSurface>
          );
        })}
      </RevealGroup>

      <Reveal className="section-heading scroll-anchor" id="planes" delay={40}>
        <span>Planes</span>
        <h2>Escala desde una prueba simple hasta una operacion completa.</h2>
      </Reveal>
      <RevealGroup className="plan-grid" stagger={110}>
        {plans.map((plan) => (
          <InteractiveSurface as="article" className="plan-card" key={plan.name} variant="card">
            <span>{plan.name}</span>
            <strong>{plan.price}<small>/mes</small></strong>
            <p>{plan.detail}</p>
            <Link className="btn btn-secondary" to="/formulario">
              <UserPlus size={18} aria-hidden="true" />
              Empezar
            </Link>
          </InteractiveSurface>
        ))}
      </RevealGroup>
    </section>
  );
}

function LandingPage() {
  return (
    <section className="page">
      <Reveal as={InteractiveSurface} className="landing-hero" surfaceVariant="panel">
        <div>
          <span className="eyebrow">
            <Rocket size={16} aria-hidden="true" />
            NexaFlow para equipos modernos
          </span>
          <h1>Una forma mas clara de convertir trabajo pendiente en resultados.</h1>
          <p>
            Reune tareas, registros y usuarios en una interfaz que se siente lista para clientes,
            profesores y equipos reales.
          </p>
          <Link className="btn btn-primary" to="/formulario">
            <ArrowRight size={18} aria-hidden="true" />
            Crear cuenta
          </Link>
        </div>
        <InteractiveSurface as="div" className="landing-panel" variant="panel">
          <InteractiveSurface as="div" className="landing-stat" variant="tile">
            <Activity aria-hidden="true" />
            <span>Productividad</span>
            <strong>+38%</strong>
          </InteractiveSurface>
          <InteractiveSurface as="div" className="landing-stat" variant="tile">
            <Target aria-hidden="true" />
            <span>Entregas a tiempo</span>
            <strong>94%</strong>
          </InteractiveSurface>
          <InteractiveSurface as="div" className="landing-stat" variant="tile">
            <ShieldCheck aria-hidden="true" />
            <span>Procesos claros</span>
            <strong>24/7</strong>
          </InteractiveSurface>
        </InteractiveSurface>
      </Reveal>

      <RevealGroup className="benefit-band" stagger={90}>
        {benefits.map((benefit) => (
          <InteractiveSurface as="div" className="benefit-item" key={benefit} variant="tile">
            <CheckCircle2 size={20} aria-hidden="true" />
            <span>{benefit}</span>
          </InteractiveSurface>
        ))}
      </RevealGroup>

      <RevealGroup className="process-grid" stagger={100}>
        {['Captura', 'Organiza', 'Entrega'].map((step, index) => (
          <InteractiveSurface as="article" className="process-step" key={step} variant="card">
            <span>0{index + 1}</span>
            <h3>{step}</h3>
            <p>
              {index === 0 && 'Recibe informacion desde formularios y nuevas solicitudes.'}
              {index === 1 && 'Asigna responsables, prioridades y estados de avance.'}
              {index === 2 && 'Cierra tareas con visibilidad y trazabilidad para todos.'}
            </p>
          </InteractiveSurface>
        ))}
      </RevealGroup>
    </section>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const { scrollToTop } = useSmoothScroll();

  useEffect(() => {
    if (location.hash) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      scrollToTop();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [location.hash, location.pathname, scrollToTop]);

  return (
    <div className="route-transition" key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/tareas" element={<TaskList />} />
        <Route path="/formulario" element={<SimpleForm />} />
        <Route path="/usuarios" element={<UserList />} />
      </Routes>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === 'dark';
  
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
      setTimeout(() => setShowLoader(false), 500);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none'; // Previene scroll en móviles
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.touchAction = '';
    };
  }, [showLoader]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('nexaflow-theme', theme);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColors[theme]);
    }
  }, [theme]);

  // Global sound effect for interactions
  useEffect(() => {
    const bubbleSound = new Audio('/sounds/bubble-pop.mp3');
    bubbleSound.volume = 0.4; // Ajustamos el volumen para que no sature

    const handleInteraction = (e) => {
      let isInteractive = e.target.closest('button, a[href], .brand-link, .nav-link, input[type="submit"], input[type="button"]');
      
      // Solo en PC las cápsulas visuales (interactive-surface) hacen sonido
      if (!isInteractive && window.innerWidth >= 768) {
        isInteractive = e.target.closest('.interactive-surface');
      }
      
      if (isInteractive) {
        // Clonamos el nodo para permitir sonidos superpuestos (clicks muy rapidos)
        const soundClone = bubbleSound.cloneNode();
        soundClone.volume = 0.4;
        soundClone.play().catch(() => {
          // Ignoramos errores de autoplay (cuando el usuario aun no ha interactuado con la pagina)
        });
      }
    };

    document.addEventListener('click', handleInteraction, { capture: true });

    return () => {
      document.removeEventListener('click', handleInteraction, { capture: true });
    };
  }, []);

  const handleThemeToggle = (event) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    // En móviles (o si no hay soporte), saltamos View Transitions por completo para evitar bugs visuales
    // con elementos "sticky". En su lugar, activamos una transición CSS suave manualmente.
    if (!document.startViewTransition || window.innerWidth < 768) {
      document.body.classList.add('theme-transitioning');
      setTheme(nextTheme);
      
      // Quitamos la clase después de que termine la transición CSS (300ms)
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 350);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 650,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <Router>
      <SmoothScrollProvider>
        <div className="app-shell">
          {showLoader && (
            <div className={`app-loader ${!isAppLoading ? 'fade-out' : ''}`}>
              <img src={nexaFlowMark} alt="NexaFlow" className="loader-logo" />
              <Loader2 className="icon-spin loader-spinner" size={32} />
            </div>
          )}
          <CustomCursor isHidden={showLoader} />
          <header className="app-header">
            <div className="nav-container">
              <Link 
                className="brand-link" 
                to="/" 
                onClick={(e) => {
                  setMenuOpen(false);
                  if (window.innerWidth < 768 && window.location.pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                <span className="brand-mark">
                  <img src={nexaFlowMark} alt="" aria-hidden="true" />
                </span>
                <span>NexaFlow</span>
              </Link>

              <button
                className={`nav-toggle ${menuOpen ? 'is-open' : ''}`}
                type="button"
                aria-label={menuOpen ? 'Cerrar navegacion' : 'Abrir navegacion'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((current) => !current)}
              >
                <div className="nav-toggle-icon">
                  <Menu size={22} className="icon-menu" />
                  <X size={22} className="icon-x" />
                </div>
              </button>

              <nav className={`app-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegacion principal">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      end={item.to === '/'}
                      key={item.to}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon size={17} aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <button
                className="theme-toggle"
                type="button"
                aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
                onClick={handleThemeToggle}
              >
                {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
                <span>{isDark ? 'Claro' : 'Oscuro'}</span>
              </button>

              <Link className="header-cta" to="/formulario">
                <Sparkles size={17} aria-hidden="true" />
                Probar ahora
              </Link>
            </div>
          </header>

          <main className="main-content">
            <AnimatedRoutes />
          </main>
          <InteractiveBubbles />
        </div>
      </SmoothScrollProvider>
    </Router>
  );
}

export default App;
