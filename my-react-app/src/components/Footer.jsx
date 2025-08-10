   import { motion } from "framer-motion";
   
   export default function Footer() {

    
                return (
                        <motion.footer
                            className="mt-20 border-t border-gray-700 py-2 text-center text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                        >
                            © 2025 MyBrand. Все права защищены.
                            
                        </motion.footer>
                        
                    )}
