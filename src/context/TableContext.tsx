import { createContext, useContext } from 'react';
import axios from 'axios';

interface BlogFormData {
  Image: String,
  Titre: String,
  Content: String,
  DateU: String,
};

interface ContactFormData {
    Nom: string;
    Email: string;
    Sujet: string;
    Message: string;
  }
  
  interface MenuFormData {
    Image: string;
    Nom: string;
    Description: string;
    Prix: number;
    Type: string;
  }
  
  interface MenuTypeFormData {
    Name: string;
  }
  
  interface MessageFormData {
    Sujet: string;
    Message: string;
    ID_Sent: string;
  }
  
  interface PostFormData {
    Name: string;
    Salaire: number;
  }
  
  interface ReservationFormData {
    firstName: string;
    lastName: string;
    Email: string;
    CIN: string;
    ID_Rooms: string;
    Date_Debut: Date;
    Date_Fin: Date;
    Duree: number;
    Paid: string;
  }
  
  interface ReviewFormData {
    oneStar: number;
    twoStars: number;
    threeStars: number;
    fourStars: number;
    fiveStars: number;
    starRating: number;
    score: number;
    Nom: string;
    Message: string;
    Image: string;
  }
  
  interface RoomFormData {
    Room_Number: string;
    Floor_Number: string;
    Name: string;
    Image: string;
    Description: string;
    Max: number;
    View: string;
    Size: string;
    Bed_Number: string;
    Type: string;
    Rating: number;
    Price: number;
  }
  
  interface RoomTypeFormData {
    Name: string;
  }
  
  interface SliderFormData {
    Image: string;
    Titre: string;
    Text: string;
    DateU: string;
  }
  
  interface TestimonyFormData {
    comment: string;
    name: string;
    image: string;
    title: string;
  }
  
  interface AuthContextType {
    submitBlogForm: (formData: BlogFormData) => void;
    submitContactForm: (formData: ContactFormData) => void;
    submitMenuForm: (formData: MenuFormData) => void;
    submitMenuTypeForm: (formData: MenuTypeFormData) => void;
    submitMessageForm: (formData: MessageFormData) => void;
    submitPostForm: (formData: PostFormData) => void;
    submitReservationForm: (formData: ReservationFormData) => void;
    submitReviewForm: (formData: ReviewFormData) => void;
    submitRoomForm: (formData: RoomFormData) => void;
    submitRoomTypeForm: (formData: RoomTypeFormData) => void;
    submitSliderForm: (formData: SliderFormData) => void;
    submitTestimonyForm: (formData: TestimonyFormData) => void;
  }
  
  const AuthContext = createContext<AuthContextType>({
    submitBlogForm: () => {},
    submitContactForm: () => {},
    submitMenuForm: () => {},
    submitMenuTypeForm: () => {},
    submitMessageForm: () => {},
    submitPostForm: () => {},
    submitReservationForm: () => {},
    submitReviewForm: () => {},
    submitRoomForm: () => {},
    submitRoomTypeForm: () => {},
    submitSliderForm: () => {},
    submitTestimonyForm: () => {},
  });
  
  export const useTable = () => useContext(AuthContext);
  
  export const TableProvider: React.FC = ({ children }) => {

    const submitBlogForm = async (formData: BlogFormData) => {
      try {
        // Make an HTTP request to submit the blog form data
        await axios.post('http://localhost:7000/blogs', formData);
        console.log('Blog form submitted successfully');
        // Handle success, show confirmation message, etc.
      } catch (error) {
        console.error('Blog form submission failed:', error);
        // Handle submission failure, show error message, etc.
      }
    };
  
    const submitContactForm = async (formData: ContactFormData) => {
      try {
        // Make an HTTP request to submit the contact form data
        await axios.post('http://localhost:7000/contacts', formData);
        console.log('Contact form submitted successfully');
        // Handle success, show confirmation message, etc.
      } catch (error) {
        console.error('Contact form submission failed:', error);
        // Handle submission failure, show error message, etc.
      }
    };
  
    const submitMenuForm = async (formData: MenuFormData) => {
      try {
        // Make an HTTP request to submit the menu form data
        await axios.post('http://localhost:7000/menus', formData);
        console.log('Menu form submitted successfully');
        // Handle success, show confirmation message, etc.
      } catch (error) {
        console.error('Menu form submission failed:', error);
        // Handle submission failure, show error message, etc.
      }
    };
  
    const submitMenuTypeForm = async (formData: MenuTypeFormData) => {
      try {
        // Make an HTTP request to submit the menu type form data
        await axios.post('http://localhost:7000/menuTypes', formData);
        console.log('Menu type form submitted successfully');
        // Handle success, show confirmation message, etc.
      } catch (error) {
        console.error('Menu type form submission failed:', error);
        // Handle submission failure, show error message, etc.
      }
    };
  
    const submitMessageForm = async (formData: MessageFormData) => {
      try {
        // Make an HTTP request to submit the message form data
        await axios.post('http://localhost:7000/messages', formData);
        console.log('Message form submitted successfully');
        // Handle success, show confirmation message, etc.
      } catch (error) {
        console.error('Message form submission failed:', error);
        // Handle submission failure, show error message, etc.
      }
    };
  
    const submitPostForm = async (formData: PostFormData) => {
      try {
        // Make an HTTP request to submit the post form data
        await axios.post('http://localhost:7000/posts', formData);
        console.log('Post form submitted successfully');
        // Handle success, show confirmation message, etc.
      } catch (error) {
        console.error('Post form submission failed:', error);
        // Handle submission failure, show error message, etc.
      }
    };
  
    const submitReservationForm = async (formData: ReservationFormData) => {
      try {
        // Make an HTTP request to submit the reservation form data
        await axios.post('http://localhost:7000/reservations', formData);
        console.log('Reservation form submitted successfully');
        // Handle success, show confirmation message, etc.
      } catch (error) {
        console.error('Reservation form submission failed:', error);
        // Handle submission failure, show error message, etc.
      }
    };
  
    const submitReviewForm = async (formData: ReviewFormData) => {
      try {
        // Make an HTTP request to submit the review form data
        await axios.post('http://localhost:7000/reviews', formData);
        console.log('Review form submitted successfully');
        // Handle success, show confirmation message, etc.
      } catch (error) {
        console.error('Review form submission failed:', error);
        // Handle submission failure, show error message, etc.
      }
    };
  
    const submitRoomForm = async (formData: RoomFormData) => {
      try {
        // Make an HTTP request to submit the room form data
        await axios.post('http://localhost:7000/rooms', formData);
        console.log('Room form submitted successfully');
        // Handle success, show confirmation message, etc.
      } catch (error) {
        console.error('Room form submission failed:', error);
        // Handle submission failure, show error message, etc.
      }
    };
  
    const submitRoomTypeForm = async (formData: RoomTypeFormData) => {
      try {
        // Make an HTTP request to submit the room type form data
        await axios.post('http://localhost:7000/roomTypes', formData);
        console.log('Room type form submitted successfully');
        // Handle success, show confirmation message, etc.
      } catch (error) {
        console.error('Room type form submission failed:', error);
        // Handle submission failure, show error message, etc.
      }
    };
  
    const submitSliderForm = async (formData: SliderFormData) => {
      try {
        // Make an HTTP request to submit the slider form data
        await axios.post('http://localhost:7000/sliders', formData);
        console.log('Slider form submitted successfully');
        // Handle success, show confirmation message, etc.
      } catch (error) {
        console.error('Slider form submission failed:', error);
        // Handle submission failure, show error message, etc.
      }
    };
  
    const submitTestimonyForm = async (formData: TestimonyFormData) => {
      try {
        // Make an HTTP request to submit the testimony form data
        await axios.post('http://localhost:7000/testimonies', formData);
        console.log('Testimony form submitted successfully');
        // Handle success, show confirmation message, etc.
      } catch (error) {
        console.error('Testimony form submission failed:', error);
        // Handle submission failure, show error message, etc.
      }
    };
  
    return (
      <AuthContext.Provider
        value={{
          submitBlogForm,
          submitContactForm,
          submitMenuForm,
          submitMenuTypeForm,
          submitMessageForm,
          submitPostForm,
          submitReservationForm,
          submitReviewForm,
          submitRoomForm,
          submitRoomTypeForm,
          submitSliderForm,
          submitTestimonyForm,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };