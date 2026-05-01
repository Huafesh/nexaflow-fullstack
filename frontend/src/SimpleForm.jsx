import { useState, useEffect, useRef } from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  Send,
  UserRound,
  UserPlus,
  IdCard,
  Phone,
} from 'lucide-react';
import InteractiveSurface from './InteractiveSurface';
import Reveal from './Reveal';
import Typewriter from './Typewriter';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

const initialForm = {
  nombre: '',
  correo: '',
  empresa: '',
  dni: '',
  telefono: '',
};

function SimpleForm() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const messageRef = useRef(null);

  useEffect(() => {
    let timeout;
    if (message && message.type === 'success' && !isErasing) {
      timeout = setTimeout(() => {
        setIsErasing(true);
      }, 5500); // Tiempo suficiente para leer
    }
    return () => clearTimeout(timeout);
  }, [message, isErasing]);

  useEffect(() => {
    if (message && window.innerWidth < 768) {
      // Damos tiempo a que el teclado se cierre y el DOM se actualice
      setTimeout(() => {
        window.scrollTo({ 
          top: document.body.scrollHeight + 200, // +200 extra seguro para llegar hasta el fondo
          behavior: 'smooth' 
        });
      }, 400);
    }
  }, [message]);

  const handleEraseComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      setMessage(null);
      setIsErasing(false);
      setIsExiting(false);
    }, 400); // Espera a que termine la transicion CSS fade out
  };

  const handleChange = (event) => {
    let { name, value } = event.target;
    
    // Solo permitir números en el DNI y teléfono
    if (name === 'dni' || name === 'telefono') {
      value = value.replace(/\D/g, '');
    }

    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }));
    setMessage(null);
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.nombre.trim()) {
      nextErrors.nombre = 'Ingresa tu nombre.';
    }

    if (!formData.correo.trim()) {
      nextErrors.correo = 'Ingresa tu correo.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      nextErrors.correo = 'Usa un correo valido.';
    }

    if (!formData.empresa.trim()) {
      nextErrors.empresa = 'Ingresa el nombre de tu empresa.';
    }

    if (formData.dni.trim() && !/^\d{8}$/.test(formData.dni.trim())) {
      nextErrors.dni = 'El DNI debe tener 8 dígitos numéricos.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setIsSubmitting(true);
      setMessage(null);

      try {
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setMessage({
            type: 'success',
            text: '¡Registro completado! Hemos guardado tus datos de forma segura.'
          });
          setFormData({ nombre: '', correo: '', empresa: '', dni: '', telefono: '' });
        } else {
          setMessage({
            type: 'error',
            text: result.error || 'Error al procesar el registro. Intenta de nuevo.'
          });
        }
      } catch (error) {
        console.error('Error de red:', error);
        setMessage({
          type: 'error',
          text: 'No se pudo conectar con el servidor. ¿El backend está corriendo?'
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setMessage({
        type: 'error',
        text: 'Revisa los campos marcados antes de continuar.',
      });
    }
  };

  return (
    <section className="page form-page">
      <Reveal className="page-intro compact">
        <span className="eyebrow">
          <UserPlus size={16} aria-hidden="true" />
          Registro
        </span>
        <h1>Activa tu espacio de trabajo en minutos.</h1>
        <p>
          Completa el formulario para simular el alta de un nuevo cliente en NexaFlow.
        </p>
      </Reveal>

      <div className="form-layout">
        <Reveal as={InteractiveSurface} className="summary-panel form-summary" surfaceVariant="panel">
          <CheckCircle2 aria-hidden="true" />
          <h2>Onboarding guiado</h2>
          <p>Validamos la informacion esencial para crear un registro limpio y util.</p>
          <ul>
            <InteractiveSurface as="li" variant="tile">Datos personales claros</InteractiveSurface>
            <InteractiveSurface as="li" variant="tile">Correo con formato valido</InteractiveSurface>
            <InteractiveSurface as="li" variant="tile">Empresa asociada al workspace</InteractiveSurface>
          </ul>
        </Reveal>

        <Reveal delay={90}>
          <InteractiveSurface
            as="form"
            className="professional-form"
            onSubmit={handleSubmit}
            noValidate
            surfaceVariant="panel"
          >
          <div className="field-group">
            <label htmlFor="nombre">Nombre completo</label>
            <div className={`field-control ${errors.nombre ? 'has-error' : ''}`}>
              <UserRound size={18} aria-hidden="true" />
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Mariana Torres"
                disabled={isSubmitting}
              />
            </div>
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="correo">Correo corporativo</label>
            <div className={`field-control ${errors.correo ? 'has-error' : ''}`}>
              <Mail size={18} aria-hidden="true" />
              <input
                id="correo"
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="mariana@empresa.com"
                disabled={isSubmitting}
              />
            </div>
            {errors.correo && <span className="field-error">{errors.correo}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="empresa">Empresa</label>
            <div className={`field-control ${errors.empresa ? 'has-error' : ''}`}>
              <Building2 size={18} aria-hidden="true" />
              <input
                id="empresa"
                type="text"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                placeholder="Nexa Studio"
                disabled={isSubmitting}
              />
            </div>
            {errors.empresa && <span className="field-error">{errors.empresa}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="dni">DNI (Opcional)</label>
            <div className={`field-control ${errors.dni ? 'has-error' : ''}`}>
              <IdCard size={18} aria-hidden="true" />
              <input
                id="dni"
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="12345678"
                disabled={isSubmitting}
                maxLength="8"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            {errors.dni && <span className="field-error">{errors.dni}</span>}
          </div>

          <div className="field-group phone-field-group">
            <label htmlFor="telefono">Teléfono de contacto (Opcional)</label>
            <div className={`field-control ${errors.telefono ? 'has-error' : ''}`}>
              <PhoneInput
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={(value) => {
                  setFormData((currentData) => ({ ...currentData, telefono: value || '' }));
                  setErrors((currentErrors) => ({ ...currentErrors, telefono: '' }));
                  setMessage(null);
                }}
                defaultCountry="PE"
                placeholder="987 654 321"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {message && (
            <div ref={messageRef} style={{ marginBottom: '20px' }}>
              <Reveal delay={0}>
                <InteractiveSurface as="div" className={`form-message ${message.type} ${isExiting ? 'is-exiting' : ''}`} variant="tile">
                  {message.type === 'success' ? (
                    <CheckCircle2 size={20} aria-hidden="true" />
                  ) : (
                    <AlertCircle size={20} aria-hidden="true" />
                  )}
                  <Typewriter 
                    text={message.text} 
                    speed={30} 
                    delay={100} 
                    isErasing={isErasing} 
                    onEraseComplete={handleEraseComplete} 
                  />
                </InteractiveSurface>
              </Reveal>
            </div>
          )}

          <button className="btn btn-primary form-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={18} aria-hidden="true" className="icon-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send size={18} aria-hidden="true" />
                Enviar registro
              </>
            )}
          </button>
          </InteractiveSurface>
        </Reveal>
      </div>
    </section>
  );
}

export default SimpleForm;
