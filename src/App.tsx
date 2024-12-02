"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Transformer,
} from "react-konva";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bold, Italic, Type, PaintBucket, Download } from "lucide-react";

export default function MemeGenerator() {
  const [backgroundImage, setBackgroundImage] =
    useState<HTMLImageElement | null>(null);
  const [personImage, setPersonImage] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(20);
  const [personPosition, setPersonPosition] = useState({ x: 100, y: 100 });
  const stageRef = useRef<any>(null);
  const personImageRef = useRef<any>(null);
  const textRef = useRef<any>(null);
  const backgroundImageRef = useRef<any>(null);
  const [selectedBackground, setSelectedBackground] = useState<string>("");
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [stageSize, setStageSize] = useState({ width: 500, height: 500 });

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const clickedOnStage = e.target instanceof HTMLCanvasElement;
      if (!clickedOnStage) {
        setSelectedNode(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.querySelector(".stage-container");
      if (container) {
        const containerWidth = container.clientWidth;
        setStageSize({
          width: Math.max(500, containerWidth),
          height: Math.max(500, containerWidth),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const backgroundImages = [
    "/assets/background1.jpg",
    "/assets/background2.jpg",
    "/assets/background3.webp",
  ];

  const personImages = ["/assets/chill-guy.png"];

  const handleBackgroundSelect = (imagePath: string) => {
    const img = new window.Image();
    img.onload = () => setBackgroundImage(img);
    img.src = imagePath;
    setSelectedBackground(imagePath);
  };

  const handlePersonSelect = (imagePath: string) => {
    const img = new window.Image();
    img.onload = () => setPersonImage(img);
    img.src = imagePath;
    setSelectedPerson(imagePath);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
  };

  const handleDownload = () => {
    if (stageRef.current) {
      const transformers = stageRef.current.find("Transformer");
      transformers.forEach((transformer: any) => {
        transformer.nodes([]);
      });

      const uri = stageRef.current.toDataURL();
      const link = document.createElement("a");
      link.download = "meme.png";
      link.href = uri;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">
        Meme Generator
      </h1>
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
        <Card>
          <CardContent className="p-2">
            <div className="stage-container w-full">
              <Stage
                width={stageSize.width}
                height={stageSize.height}
                ref={stageRef}
                className="bg-white shadow-lg rounded-lg"
              >
                <Layer>
                  {backgroundImage && (
                    <KonvaImage
                      image={backgroundImage}
                      width={stageSize.width}
                      height={stageSize.height}
                      ref={backgroundImageRef}
                      draggable
                      onClick={() =>
                        setSelectedNode(backgroundImageRef.current)
                      }
                    />
                  )}
                  {personImage && (
                    <KonvaImage
                      image={personImage}
                      width={250}
                      height={250}
                      x={personPosition.x}
                      y={personPosition.y}
                      draggable
                      ref={personImageRef}
                      onDragEnd={(e) =>
                        setPersonPosition({ x: e.target.x(), y: e.target.y() })
                      }
                      onClick={() => setSelectedNode(personImageRef.current)}
                      onDragStart={() =>
                        setSelectedNode(personImageRef.current)
                      }
                    />
                  )}
                  {text !== "" && (
                    <>
                      <Text
                        text={text}
                        x={textPosition.x}
                        y={textPosition.y}
                        fontSize={fontSize}
                        fill={undefined} // No fill for the stroke-only text
                        fontStyle={isItalic ? "italic" : "normal"}
                        fontWeight={isBold ? "bold" : "normal"}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth} // Stroke width affects only the outer layer
                        draggable
                        onDragEnd={(e) =>
                          setTextPosition({ x: e.target.x(), y: e.target.y() })
                        }
                        onClick={() => setSelectedNode(textRef.current)}
                        onDragStart={() => setSelectedNode(textRef.current)}
                      />

                      <Text
                        text={text}
                        x={textPosition.x}
                        y={textPosition.y}
                        fontSize={fontSize}
                        fill={textColor} // Main text color
                        fontStyle={isItalic ? "italic" : "normal"}
                        fontWeight={isBold ? "bold" : "normal"}
                        draggable
                        ref={textRef}
                        onDragEnd={(e) =>
                          setTextPosition({ x: e.target.x(), y: e.target.y() })
                        }
                        onClick={() => setSelectedNode(textRef.current)}
                        onDragStart={() => setSelectedNode(textRef.current)}
                      />
                    </>
                  )}
                  <Transformer
                    ref={(node) => {
                      if (node) {
                        node.nodes(selectedNode ? [selectedNode] : []);
                      }
                    }}
                    enabledAnchors={[
                      "top-left",
                      "top-right",
                      "bottom-left",
                      "bottom-right",
                    ]}
                  />
                </Layer>
              </Stage>
            </div>
          </CardContent>
        </Card>
        <div className="w-full lg:w-1/2 space-y-6">
          <Tabs defaultValue="background" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="background">Background</TabsTrigger>
              <TabsTrigger value="person">Person</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
            </TabsList>
            <TabsContent value="background" className="mt-4 min-h-[200px]">
              <Card>
                <CardContent className="p-4">
                  <Label className="mb-2 block">Select Background</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {backgroundImages.map((bg, index) => (
                      <img
                        key={index}
                        src={bg}
                        className={`w-full h-full object-cover cursor-pointer rounded-md transition-all ${
                          selectedBackground === bg
                            ? "ring-2 ring-primary"
                            : "hover:opacity-80"
                        }`}
                        onClick={() => handleBackgroundSelect(bg)}
                        alt={`Background ${index + 1}`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="person" className="mt-4 min-h-[200px]">
              <Card>
                <CardContent className="p-4">
                  <Label className="mb-2 block">Select Person</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {personImages.map((person, index) => (
                      <img
                        key={index}
                        src={person}
                        className={`w-full h-full object-cover cursor-pointer rounded-md transition-all ${
                          selectedPerson === person
                            ? "ring-2 ring-primary"
                            : "hover:opacity-80"
                        }`}
                        onClick={() => handlePersonSelect(person)}
                        alt={`Person ${index + 1}`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="text" className="mt-4 min-h-[200px]">
              <Card>
                <CardContent className="space-y-4 p-4">
                  <div>
                    <Label htmlFor="text-input" className="mb-2 block">
                      Add Text
                    </Label>
                    <Input
                      id="text-input"
                      type="text"
                      value={text}
                      onChange={handleTextChange}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Toggle
                      pressed={isBold}
                      onPressedChange={setIsBold}
                      aria-label="Toggle bold"
                    >
                      <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                      pressed={isItalic}
                      onPressedChange={setIsItalic}
                      aria-label="Toggle italic"
                    >
                      <Italic className="h-4 w-4" />
                    </Toggle>
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      <Input
                        type="color"
                        value={textColor}
                        onChange={handleTextColorChange}
                        className="w-8 h-8 p-0 border-none"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Font Size</Label>
                    <Slider
                      min={10}
                      max={100}
                      step={1}
                      value={[fontSize]}
                      onValueChange={handleFontSizeChange}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Text Outline Width</Label>
                    <Slider
                      min={0}
                      max={20}
                      step={0.1}
                      value={[strokeWidth]}
                      onValueChange={(value) => setStrokeWidth(value[0])}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <PaintBucket className="h-4 w-4" />
                    <Input
                      type="color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="w-8 h-8 p-0 border-none"
                    />
                    <span className="text-sm text-gray-500">Outline Color</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download Meme
          </Button>
        </div>
      </div>
    </div>
  );
}
