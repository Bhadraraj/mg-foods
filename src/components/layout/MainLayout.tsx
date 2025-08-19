@@ .. @@
 import { useState, useEffect } from 'react';
 import { Outlet } from 'react-router-dom';
-import Sidebar from '../components/Sidebar';
-import Topbar from '../components/Topbar';
+import Sidebar from '../components/layout/Sidebar';
+import Topbar from '../components/layout/Topbar';
 
 const MainLayout: React.FC = () => {