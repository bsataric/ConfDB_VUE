import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import theme from '../styles/variables/theme_colors.scss'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        // primary: colors.blue.lighten3,
        primary: theme['primary-light'],
        secondary: theme['secondary-light'],
        accent: theme.accent,

        error: theme.error,
        info: theme.info,
        success: theme.success,
        warning: theme.warning,
      },
      dark: {
        primary: theme['primary-dark'],
        secondary: theme['secondary-dark'],

        // primary: "#028826",
        // secondary: "#424242",
        // accent: "#82B1FF",
        // error: "#FF5252",
        // info: "#2196F3",
        // success: "#4CAF50",
        // warning: "#FFC107",
      },
    },
  },
})
