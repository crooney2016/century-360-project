"use client";
import { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { Grid, GridItem, VStack } from "@chakra-ui/react";
import { Sidebar } from "../admin/Sidebar";
import { ParticleBackground } from "../atoms/ParticleBackground";
import { GlassOverlay } from "../atoms/GlassOverlay";
import { sidebarEnter, cardEnter, staggerContainer } from "../../lib/animations";

export function AdminShell({ children }: PropsWithChildren) {
  return (
    <>
      <ParticleBackground
        particleCount={15}
        color="rgba(59, 130, 246, 0.08)"
        speed={0.8}
        zIndex={-1}
      />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <Grid
          templateColumns="200px 1fr"
          minH="calc(100dvh - 3.5rem)"
          gap={0}
          position="relative"
          zIndex={10}
        >
          <GridItem as={motion.aside} variants={sidebarEnter}>
            <GlassOverlay
              intensity="light"
              h="full"
              borderRadius={0}
              borderRight="1px solid"
              borderColor="gray.200/50"
            >
              <Sidebar />
            </GlassOverlay>
          </GridItem>

          <GridItem
            as={motion.section}
            variants={cardEnter}
            p={6}
            bg="gradient-to-br from-gray.50/80 to-blue.50/30"
            backdropFilter="blur(8px)"
          >
            <VStack
              as={motion.div}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              align="stretch"
              gap={0}
            >
              {children}
            </VStack>
          </GridItem>
        </Grid>
      </motion.div>
    </>
  );
}
