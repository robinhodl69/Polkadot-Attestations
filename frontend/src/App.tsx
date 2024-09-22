import { useEffect, useState } from "react";
import "./App.css";

// POLKADOT API
import { ApiPromise, WsProvider } from "@polkadot/api";
import Home from "./components/pages/Home"; // Página Home
import Schemas from "./components/pages/schemas"; // Página Schemas
import Attestations from "./components/pages/attestations"; // Página Attestations
import CreateSchema from "./components/pages/createSchema";
import { ChakraProvider, Flex } from "@chakra-ui/react"; // ChakraProvider importado
import theme from "./theme/theme"; // Importa tu theme personalizado

// Añadir react-router-dom para gestionar las rutas
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [api, setApi] = useState<ApiPromise | null>(null);

  const setupApi = async () => {
    // POLKADOT ASSETS HUB RPC FOR NON LOCAL DEVELOPMENT UNTIL WE HAVE OUR OWN NODE
    const wsProvider = new WsProvider(
      "wss://polkadot-asset-hub-rpc.polkadot.io"
    );
    // USE THIS FOR LOCAL DEVELOPMENT WITH THE NODE RUNNING
    // const wsProvider = new WsProvider("ws://127.0.0.1:9944");
    const api = await ApiPromise.create({ provider: wsProvider });
    setApi(api);

    // Get the chain & node information information via rpc calls
    const [chain, nodeName, nodeVersion] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version(),
    ]);

    console.log(
      `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
    );
  };

  useEffect(() => {
    setupApi();
  }, []);

  useEffect(() => {
    if (api) {
      console.log("PolkAttest is connected");
      console.log(api);

      const getBlock = async () => {
        const block = await api.query.timestamp.now();
        console.log("Block:", block.toPrimitive());
      };

      const getAttestations = async () => {
        const attestations = await api.query.attestations.attestations();
        console.log("Attestations:", attestations.toHuman());
      };

      getAttestations();

      getBlock();
    }
  }, [api]);

  return (
    <ChakraProvider theme={theme}>
      {" "}
      {/* Envolvemos el contenido en ChakraProvider */}
      <Router>
        {" "}
        {/* Añadimos Router para manejar las rutas */}
        <Flex w="100%" h="100%">
          <Routes>
            {" "}
            {/* Definimos las rutas aquí */}
            <Route path="/" element={<Home />} />{" "}
            {/* Ruta para la página Home */}
            <Route path="/schemas" element={<Schemas />} />{" "}
            {/* Ruta para la página Schemas */}
            <Route path="/attestations" element={<Attestations />} />{" "}
            {/* Ruta para la página Attestations */}
            <Route path="/createSchema" element={<CreateSchema />} />{" "}
            {/* Ruta para la página createSchema */}
          </Routes>
        </Flex>
      </Router>
    </ChakraProvider>
  );
}

export default App;
