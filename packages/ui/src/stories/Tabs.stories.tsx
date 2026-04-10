import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card";

const meta: Meta<typeof Tabs> = {
  title: "Primitivos/Tabs",
  component: Tabs,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" style={{ width: "400px" }}>
      <TabsList style={{ width: "100%" }}>
        <TabsTrigger value="account" style={{ flex: 1 }}>Conta</TabsTrigger>
        <TabsTrigger value="password" style={{ flex: 1 }}>Senha</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>Gerencie as configurações da sua conta aqui.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Conteúdo da aba Conta.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Senha</CardTitle>
            <CardDescription>Altere sua senha aqui.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Conteúdo da aba Senha.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};
