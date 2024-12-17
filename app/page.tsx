'use client';
import LoginButton from "@/components/auth/login-button";
import RegisterButton from "@/components/auth/register-button";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { useEffect } from "react";
import { Engine, Render, World, Bodies, Runner, MouseConstraint } from "matter-js";

const words = [
    { text: "这是" },
    { text: "一个" },
    { text: "类似于" },
    { text: "咸鱼" },
    { text: "二手" },
    { text: "交易平台" },
    { text: "的Web项目.", className: "text-blue-500 dark:text-blue-500" },
];

const GravityExample: React.FC = () => {
    useEffect(() => {
        const engine = Engine.create();
        const render = Render.create({
            element: document.body, 
            engine: engine,
            options: {
                width: document.body.clientWidth,
                height: document.body.clientHeight,
                background: "transparent",
                wireframes: false,
            },
        });

        engine.gravity.y = 0.3;

        const box = Bodies.rectangle(document.body.clientWidth / 8, 100, 94, 94, {
            friction: 0.5,
            frictionAir: 0.00001,
            restitution: 0.8,
            render: {
                sprite: {
                    texture: "homesvg/圣诞冰淇淋.svg",
                    xScale: 1,
                    yScale: 1,
                },
            },
        });

        const box2 = Bodies.rectangle(document.body.clientWidth / 8 * 2, 400, 94, 94, {
            friction: 0.5,
            frictionAir: 0.00001,
            restitution: 0.8,
            render: {
                sprite: {
                    texture: "homesvg/圣诞拐杖.svg",
                    xScale: 1,
                    yScale: 1,
                },
            },
        });

        const box3 = Bodies.rectangle(document.body.clientWidth / 8 * 3, 50, 94, 94, {
            friction: 0.5,
            frictionAir: 0.00001,
            restitution: 0.8,
            render: {
                sprite: {
                    texture: "homesvg/圣诞帽.svg",
                    xScale: 1,
                    yScale: 1,
                },
            },
        });

        const box4 = Bodies.rectangle(document.body.clientWidth / 8 * 4, 200, 94, 94, {
            friction: 0.5,
            frictionAir: 0.00001,
            restitution: 0.8,
            render: {
                sprite: {
                    texture: "homesvg/圣诞麋鹿.svg",
                    xScale: 1,
                    yScale: 1,
                },
            },
        });

        const box5 = Bodies.rectangle(document.body.clientWidth / 8 * 5, 190, 94, 94, {
            friction: 0.5,
            frictionAir: 0.00001,
            restitution: 0.8,
            render: {
                sprite: {
                    texture: "homesvg/圣诞树.svg",
                    xScale: 1,
                    yScale: 1,
                },
            },
        });


        const box6 = Bodies.rectangle(document.body.clientWidth / 8 * 6, 300, 94, 94, {
            friction: 0.5,
            frictionAir: 0.00001,
            restitution: 0.8,
            render: {
                sprite: {
                    texture: "homesvg/圣诞袜子.svg",
                    xScale: 1,
                    yScale: 1,
                },
            },
        });

        const box7 = Bodies.rectangle(document.body.clientWidth / 8 * 7, 700, 94, 94, {
            friction: 0.5,
            frictionAir: 0.00001,
            restitution: 0.8,
            render: {
                sprite: {
                    texture: "homesvg/圣诞小熊.svg",
                    xScale: 1,
                    yScale: 1,
                },
            },
        });


        const box8 = Bodies.rectangle(document.body.clientWidth, 300, 94, 94, {
            friction: 0.5,
            frictionAir: 0.00001,
            restitution: 0.8,
            render: {
                sprite: {
                    texture: "homesvg/圣诞雪帽.svg",
                    xScale: 1,
                    yScale: 1,
                },
            },
        });


        const mouseConstraint = MouseConstraint.create(engine);

        World.add(engine.world, [
            box, box2, box3, box4, box5, box6, box7, box8,
            Bodies.rectangle(document.body.clientWidth / 2, 0, document.body.clientWidth, -1, { isStatic: true }),
            Bodies.rectangle(document.body.clientWidth / 2, document.body.clientHeight, document.body.clientWidth, -1, { isStatic: true }),
            Bodies.rectangle(0, document.body.clientHeight / 2, -1, document.body.clientHeight, { isStatic: true }),
            Bodies.rectangle(document.body.clientWidth, document.body.clientHeight / 2, -1, document.body.clientHeight, { isStatic: true }),
            mouseConstraint,
        ]);

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        const handleResize = () => {
            render.options.width = document.body.clientWidth;
            render.options.height = document.body.clientHeight;
            render.canvas.width = document.body.clientWidth;
            render.canvas.height = document.body.clientHeight;

            World.clear(engine.world, false); // 不清除事件监听器
            World.add(engine.world, [
                box, box2, box3, box4, box5, box6, box7, box8,
                Bodies.rectangle(document.body.clientWidth / 2, 0, document.body.clientWidth, -1, { isStatic: true }),
                Bodies.rectangle(document.body.clientWidth / 2, document.body.clientHeight, document.body.clientWidth, -1, { isStatic: true }),
                Bodies.rectangle(0, document.body.clientHeight / 2, -1, document.body.clientHeight, { isStatic: true }),
                Bodies.rectangle(document.body.clientWidth, document.body.clientHeight / 2, -1, document.body.clientHeight, { isStatic: true }),
                mouseConstraint,
            ]);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            Render.stop(render);
            Runner.stop(runner);
            Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
        };
    }, []);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-neutral-600 dark:text-neutral-200 font-Jaro text-xs sm:text-base select-none">
                欢迎到来,开始交易吧!!!
            </p>
            <TypewriterEffectSmooth words={words} />
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 select-none">
                <LoginButton />
                <RegisterButton />
            </div>
        </div>
    );
};

export default GravityExample;